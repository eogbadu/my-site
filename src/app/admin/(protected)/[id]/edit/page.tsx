import { notFound } from "next/navigation";

import PostForm from "@/components/admin/PostForm";
import { getPostById } from "@/db/queries";
import { requireAdmin } from "@/lib/admin";
import { updatePost } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <section className="space-y-6">
      <p className="eyebrow">Editing</p>
      <PostForm
        submitLabel="Save changes"
        action={updatePost.bind(null, post.id)}
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          body: post.body,
          tags: post.tags.join(", "),
          status: post.status,
        }}
      />
    </section>
  );
}
