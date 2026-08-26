import PostForm from "@/components/admin/PostForm";
import { requireAdmin } from "@/lib/admin";
import { createPost } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  await requireAdmin();

  return (
    <section className="space-y-6">
      <p className="eyebrow">New post</p>
      <PostForm
        submitLabel="Create post"
        action={createPost}
        initial={{
          title: "",
          slug: "",
          excerpt: "",
          coverImage: "",
          body: "",
          tags: "",
          status: "draft",
        }}
      />
    </section>
  );
}
