export interface PostMeta {
  slug: string; // folder name under /app/blog/
  title: string;
  date: string; // ISO "2025-10-19" or "Oct 19, 2025"
  excerpt?: string;
  tags?: string[];
  draft?: boolean; // if true, don't list it (you can filter)
}

export const posts: PostMeta[] = [
  {
    slug: "hello-world",
    title: "Hello, World (Why I’m Blogging)",
    date: "2025-10-19",
    excerpt: "How I plan to use this space and what to expect.",
    tags: ["meta"],
  },
  // add more here
];
