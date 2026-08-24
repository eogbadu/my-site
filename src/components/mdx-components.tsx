import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

/**
 * The styled element map for MDX content.
 *
 * This is the single source of truth for how post bodies are rendered. It is
 * consumed two ways:
 *   - via the `src/mdx-components.tsx` convention file, which @next/mdx picks up
 *     for `.mdx` route files
 *   - directly by the runtime MDX renderer once posts move into the database
 *
 * Keeping it here (rather than in the convention file) means the convention file
 * can be deleted with @next/mdx without taking the styling with it.
 */
export const mdxComponents: MDXComponents = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1 className="text-3xl font-bold mt-2 mb-3" {...props} />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="text-2xl font-semibold mt-8 mb-2" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="text-xl font-semibold mt-6 mb-2" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="leading-7 my-4 text-slate-700 dark:text-slate-200" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="list-disc pl-6 my-4 space-y-1" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="list-decimal pl-6 my-4 space-y-1" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-l-4 border-slate-300 dark:border-slate-700 pl-4 italic my-4 text-slate-600 dark:text-slate-300"
      {...props}
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-8 border-slate-200 dark:border-slate-800" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-sm"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="rounded-xl bg-slate-950 text-slate-100 p-4 overflow-x-auto my-4"
      {...props}
    />
  ),
  a: ({ href, ...props }: ComponentPropsWithoutRef<"a">) => {
    const external = typeof href === "string" && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className="underline underline-offset-4 hover:opacity-80"
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        {...props}
      />
    );
  },
  // remark-gfm tables
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="border border-slate-300 dark:border-slate-700 px-3 py-2 text-left font-semibold"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="border border-slate-300 dark:border-slate-700 px-3 py-2" {...props} />
  ),
};
