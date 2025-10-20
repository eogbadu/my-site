// src/mdx-components.tsx
import type React from "react";
import type { JSX as ReactJSX } from "react";

/** Props for intrinsic JSX tags, e.g., PropsOf<"h1"> */
type PropsOf<T extends keyof ReactJSX.IntrinsicElements> =
  ReactJSX.IntrinsicElements[T];

/** Minimal MDX mapping type (no `any`) */
type MDXComponent = (props: Record<string, unknown>) => React.ReactNode;
type MDXComponentMap = Record<string, MDXComponent>;

const base: MDXComponentMap = {
  h1: (props: PropsOf<"h1">) => (
    <h1 className="text-3xl font-bold mt-2 mb-3" {...props} />
  ),
  h2: (props: PropsOf<"h2">) => (
    <h2 className="text-2xl font-semibold mt-8 mb-2" {...props} />
  ),
  h3: (props: PropsOf<"h3">) => (
    <h3 className="text-xl font-semibold mt-6 mb-2" {...props} />
  ),
  p: (props: PropsOf<"p">) => (
    <p
      className="leading-7 my-4 text-slate-700 dark:text-slate-200"
      {...props}
    />
  ),
  ul: (props: PropsOf<"ul">) => (
    <ul className="list-disc pl-6 my-4 space-y-1" {...props} />
  ),
  ol: (props: PropsOf<"ol">) => (
    <ol className="list-decimal pl-6 my-4 space-y-1" {...props} />
  ),
  code: (props: PropsOf<"code">) => (
    <code
      className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-sm"
      {...props}
    />
  ),
  pre: (props: PropsOf<"pre">) => (
    <pre
      className="rounded-xl bg-slate-950 text-slate-100 p-4 overflow-x-auto my-4"
      {...props}
    />
  ),
  a: (props: PropsOf<"a">) => {
    // href is string | undefined on <a>
    const href = props.href;
    const external = typeof href === "string" && /^https?:\/\//.test(href);

    return (
      <a
        className="underline underline-offset-4 hover:opacity-80"
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        {...props}
      />
    );
  },
};

/** Merge our defaults with any per-page overrides */
export default function useMDXComponents(
  overrides: Partial<Record<string, MDXComponent>> = {}
): MDXComponentMap {
  const merged: MDXComponentMap = { ...base };

  for (const key in overrides) {
    const comp = overrides[key];
    if (typeof comp === "function") {
      merged[key] = comp; // only assign defined functions
    }
  }

  return merged;
}
