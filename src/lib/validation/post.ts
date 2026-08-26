import { z } from "zod";

/** Shared by the admin form and the server actions, so both agree by construction. */
export const postSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters.").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(160)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug may contain only lowercase letters, numbers, and single hyphens."
    ),
  excerpt: z.string().trim().max(400).optional().or(z.literal("")),
  /** Absolute blob URL or a site-relative path; empty means use the placeholder. */
  coverImage: z.string().trim().max(500).optional().or(z.literal("")),
  body: z.string().trim().min(1, "Post content is required."),
  /** Comma-separated in the form; split before parsing. */
  tags: z.array(z.string().trim().min(1)).max(12).default([]),
  status: z.enum(["draft", "published"]),
});

export type PostInput = z.infer<typeof postSchema>;

export type ActionResult =
  | { ok: true; slug: string }
  | { ok: false; formError?: string; fieldErrors?: Record<string, string[]> };

/** The form submits tags as one comma-separated field. */
export function parseTags(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
