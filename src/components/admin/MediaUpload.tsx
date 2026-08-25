"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { ImagePlus, Loader2 } from "lucide-react";

const ACCEPT = "image/png,image/jpeg,image/webp,image/avif,image/gif,video/mp4,video/webm";

/**
 * Uploads media straight from the browser to Vercel Blob and hands back the
 * markup to insert.
 *
 * `upload()` requests a short-lived token from /api/admin/upload and then PUTs
 * the file directly, so a large video never passes through a serverless function
 * and its ~4.5 MB body limit.
 */
export default function MediaUpload({
  onInsert,
}: {
  onInsert: (snippet: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function send(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;

    setBusy(true);
    setError(null);
    try {
      for (const file of list) {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
        });

        const isVideo = file.type.startsWith("video/");
        // Video needs real markup; an image is just markdown. The alt text is
        // left as a placeholder rather than guessed from the filename — invented
        // alt text is worse than none, because a screen-reader user cannot tell.
        onInsert(
          isVideo
            ? `\n<video controls preload="none" style={{width:"100%"}}>\n  <source src="${blob.url}" type="${file.type}" />\n</video>\n`
            : `\n![describe this image](${blob.url})\n`
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void send(e.dataTransfer.files);
        }}
        className={`rounded-lg border border-dashed px-4 py-5 text-center text-sm transition ${
          dragOver ? "border-accent bg-accent-soft" : "border-rule"
        }`}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 text-ink-muted hover:text-ink disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-accent rounded-sm"
        >
          {busy ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <ImagePlus className="w-4 h-4" aria-hidden="true" />
          )}
          {busy ? "Uploading…" : "Add image or video"}
        </button>
        <p className="mt-1 text-xs text-ink-faint">
          or drop files here — png, jpeg, webp, avif, gif, mp4, webm (max 100 MB)
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          onChange={(e) => e.target.files && void send(e.target.files)}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
