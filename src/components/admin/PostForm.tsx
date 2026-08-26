"use client";

import { useRef, useState, useTransition } from "react";
import Link from "next/link";

import MediaUpload from "@/components/admin/MediaUpload";
import { slugify } from "@/lib/slug";
import type { ActionResult } from "@/lib/validation/post";

export interface PostFormValues {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  body: string;
  tags: string;
  status: "draft" | "published";
}

const field =
  "w-full rounded-lg border border-rule bg-surface px-3 py-2 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-accent";

export default function PostForm({
  initial,
  action,
  submitLabel,
}: {
  initial: PostFormValues;
  action: (formData: FormData) => Promise<ActionResult>;
  submitLabel: string;
}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  // Stop auto-slugging once the slug has been edited by hand, or once the post
  // exists — changing a published slug breaks a live URL.
  const [slugLocked, setSlugLocked] = useState(Boolean(initial.id));
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  /** Insert uploaded media at the caret rather than appending at the end. */
  function insertAtCaret(snippet: string) {
    const el = bodyRef.current;
    if (!el) {
      setValues((v) => ({ ...v, body: v.body + snippet }));
      return;
    }
    const { selectionStart: s, selectionEnd: e } = el;
    const next = values.body.slice(0, s) + snippet + values.body.slice(e);
    setValues((v) => ({ ...v, body: next }));
    const caret = s + snippet.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  }

  function onTitle(title: string) {
    setValues((v) => ({ ...v, title, slug: slugLocked ? v.slug : slugify(title) }));
  }

  function submit(formData: FormData) {
    setErrors({});
    setFormError(null);
    startTransition(async () => {
      const result = await action(formData);
      // A successful action redirects, so anything returned here is a failure.
      if (result && !result.ok) {
        setErrors(result.fieldErrors ?? {});
        setFormError(result.formError ?? null);
      }
    });
  }

  const Err = ({ name }: { name: string }) =>
    errors[name]?.length ? (
      <p className="mt-1 text-sm text-danger">{errors[name][0]}</p>
    ) : null;

  return (
    <form action={submit} className="space-y-6">
      <div>
        <label className="block text-sm mb-1" htmlFor="title">Title</label>
        <input
          id="title" name="title" className={field} value={values.title}
          onChange={(e) => onTitle(e.target.value)} required
          aria-invalid={!!errors.title?.length}
        />
        <Err name="title" />
      </div>

      <div>
        <label className="block text-sm mb-1" htmlFor="slug">Slug</label>
        <input
          id="slug" name="slug" className={`${field} font-mono`} value={values.slug}
          onChange={(e) => { setSlugLocked(true); setValues((v) => ({ ...v, slug: e.target.value })); }}
          required aria-invalid={!!errors.slug?.length}
        />
        <p className="mt-1 text-xs text-ink-faint">
          /blog/{values.slug || "…"}
          {initial.id && initial.status === "published" && values.slug !== initial.slug && (
            <span className="text-danger"> — changing this breaks the existing URL</span>
          )}
        </p>
        <Err name="slug" />
      </div>

      <div>
        <label className="block text-sm mb-1" htmlFor="excerpt">Excerpt</label>
        <input
          id="excerpt" name="excerpt" className={field} value={values.excerpt}
          onChange={(e) => setValues((v) => ({ ...v, excerpt: e.target.value }))}
          maxLength={400}
        />
        <Err name="excerpt" />
      </div>

      <div>
        <label className="block text-sm mb-1" htmlFor="coverImage">
          Cover image{" "}
          <span className="text-ink-faint font-normal">
            — optional; defaults to the first image in the post
          </span>
        </label>
        <input
          id="coverImage" name="coverImage" className={`${field} font-mono text-xs`}
          value={values.coverImage}
          onChange={(e) => setValues((v) => ({ ...v, coverImage: e.target.value }))}
          placeholder="https://…  — leave empty to use the first image in the post"
        />
        <div className="mt-2">
          {/* Same uploader as the body, but the URL lands in this field rather
              than being inserted into the content. */}
          <MediaUpload
            onInsert={(snippet) => {
              const url = snippet.match(/\]\((https?:[^)]+)\)/)?.[1]
                ?? snippet.match(/src="([^"]+)"/)?.[1];
              if (url) setValues((v) => ({ ...v, coverImage: url }));
            }}
          />
        </div>
        {values.coverImage && (
          <p className="mt-2 flex items-center gap-3 text-xs text-ink-faint">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={values.coverImage}
              alt=""
              className="h-12 w-12 rounded border border-rule object-cover"
            />
            <button
              type="button"
              onClick={() => setValues((v) => ({ ...v, coverImage: "" }))}
              className="text-danger hover:underline underline-offset-4 rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              Remove cover
            </button>
          </p>
        )}
        <Err name="coverImage" />
      </div>

      <div>
        <label className="block text-sm mb-1" htmlFor="tags">Tags</label>
        <input
          id="tags" name="tags" className={field} value={values.tags}
          onChange={(e) => setValues((v) => ({ ...v, tags: e.target.value }))}
          placeholder="comma, separated"
        />
        <Err name="tags" />
      </div>

      <div>
        <label className="block text-sm mb-1" htmlFor="body">Content (MDX)</label>

        <div className="mb-2">
          <MediaUpload onInsert={insertAtCaret} />
        </div>

        <textarea
          ref={bodyRef}
          id="body" name="body"
          className={`${field} font-mono text-[13px] leading-6 min-h-[28rem]`}
          value={values.body}
          onChange={(e) => setValues((v) => ({ ...v, body: e.target.value }))}
          onKeyDown={(e) => {
            // Tab inserts two spaces rather than moving focus out of the editor.
            if (e.key === "Tab") {
              e.preventDefault();
              const el = e.currentTarget;
              const { selectionStart: s, selectionEnd: t } = el;
              const next = values.body.slice(0, s) + "  " + values.body.slice(t);
              setValues((v) => ({ ...v, body: next }));
              requestAnimationFrame(() => el.setSelectionRange(s + 2, s + 2));
            }
            // Cmd/Ctrl+S submits.
            if ((e.metaKey || e.ctrlKey) && e.key === "s") {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          required spellCheck
        />
        <Err name="body" />
      </div>

      <div>
        <label className="block text-sm mb-1" htmlFor="status">Status</label>
        <select
          id="status" name="status" className={field} value={values.status}
          onChange={(e) =>
            setValues((v) => ({ ...v, status: e.target.value as "draft" | "published" }))
          }
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {formError && <p role="alert" className="text-sm text-danger">{formError}</p>}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit" disabled={pending}
          className="rounded-full bg-ink text-paper px-5 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        {initial.id && (
          <Link
            href={`/admin/${initial.id}/preview`}
            className="text-sm text-ink-muted hover:text-ink link-underline rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            Preview →
          </Link>
        )}
        <Link
          href="/admin"
          className="text-sm text-ink-faint hover:text-ink rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
