"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { validateMdx } from "@/lib/mdx";
import { revalidateBlog } from "@/lib/revalidate";
import { slugify } from "@/lib/slug";
import {
  parseTags,
  postSchema,
  type ActionResult,
  type PostInput,
} from "@/lib/validation/post";

/**
 * Every export here begins with `await requireAdmin()`.
 *
 * Server Actions are publicly reachable POST endpoints addressed by action id, so
 * an auth check on the page that renders the form protects nothing. And because
 * rendering a post body executes its MDX server-side, an unguarded action here is
 * remote code execution, not just unauthorised editing.
 */

/** Postgres unique_violation. */
const UNIQUE_VIOLATION = "23505";

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === UNIQUE_VIOLATION
  );
}

async function readForm(formData: FormData) {
  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") ?? "",
    coverImage: formData.get("coverImage") ?? "",
    body: formData.get("body"),
    tags: parseTags(formData.get("tags")),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return { ok: false as const, fieldErrors };
  }

  // Refuse to store content that would 500 the public page.
  const compiled = await validateMdx(parsed.data.body);
  if (!compiled.ok) {
    return { ok: false as const, fieldErrors: { body: [compiled.error] } };
  }

  return { ok: true as const, data: parsed.data };
}

function toRow(data: PostInput) {
  return {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || null,
    coverImage: data.coverImage || null,
    body: data.body,
    tags: data.tags,
    // Derived on write, never guessed back from the slug on read.
    tagSlugs: data.tags.map(slugify),
    status: data.status,
    // The CHECK constraint makes "published with no date" impossible.
    publishedAt: data.status === "published" ? new Date() : null,
    updatedAt: new Date(),
  };
}

export async function createPost(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const parsed = await readForm(formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };

  try {
    await db.insert(posts).values(toRow(parsed.data));
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, fieldErrors: { slug: ["That slug is already taken."] } };
    }
    console.error("[admin] createPost", err);
    return { ok: false, formError: "Could not save the post." };
  }

  revalidateBlog(parsed.data.slug);
  redirect("/admin");
}

export async function updatePost(id: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const parsed = await readForm(formData);
  if (!parsed.ok) return { ok: false, fieldErrors: parsed.fieldErrors };

  const existing = await db
    .select({ slug: posts.slug, publishedAt: posts.publishedAt })
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);

  if (existing.length === 0) return { ok: false, formError: "Post not found." };

  const row = toRow(parsed.data);
  // Preserve the original publish date rather than bumping it on every edit.
  if (parsed.data.status === "published" && existing[0].publishedAt) {
    row.publishedAt = existing[0].publishedAt;
  }

  try {
    await db.update(posts).set(row).where(eq(posts.id, id));
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, fieldErrors: { slug: ["That slug is already taken."] } };
    }
    console.error("[admin] updatePost", err);
    return { ok: false, formError: "Could not save the post." };
  }

  // Revalidate the old slug too, in case it changed.
  revalidateBlog(existing[0].slug);
  revalidateBlog(parsed.data.slug);
  redirect("/admin");
}

export async function setPostStatus(id: string, status: "draft" | "published") {
  await requireAdmin();

  const existing = await db
    .select({ slug: posts.slug, publishedAt: posts.publishedAt })
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);
  if (existing.length === 0) return;

  await db
    .update(posts)
    .set({
      status,
      publishedAt:
        status === "published" ? existing[0].publishedAt ?? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id));

  revalidateBlog(existing[0].slug);
  revalidatePath("/admin");
}

export async function deletePost(id: string) {
  await requireAdmin();

  const existing = await db
    .select({ slug: posts.slug })
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);
  if (existing.length === 0) return;

  await db.delete(posts).where(eq(posts.id, id));

  revalidateBlog(existing[0].slug);
  revalidatePath("/admin");
  redirect("/admin");
}
