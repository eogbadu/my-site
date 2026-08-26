import Image from "next/image";

/**
 * Small square thumbnail for a post in a listing.
 *
 * When a post has no cover image, renders a placeholder rather than collapsing —
 * a row that sometimes has an image and sometimes does not looks broken, whereas
 * a consistent block reads as intentional. The placeholder shows the title's
 * first character in the display serif on the surface ground, so it stays quiet
 * and matches the rest of the design instead of shouting "missing image".
 *
 * Decorative in the placeholder case: the adjacent heading already names the
 * post, so the mark is aria-hidden rather than announcing a redundant letter.
 */
export default function PostThumb({
  src,
  title,
  className = "",
}: {
  src: string | null;
  title: string;
  className?: string;
}) {
  const initial = title.trim().charAt(0).toUpperCase() || "·";

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-md border border-rule bg-surface ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="96px"
          className="object-cover"
          // Decorative: the heading beside it carries the meaning.
          aria-hidden="true"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center font-display text-2xl text-ink-faint"
        >
          {initial}
        </span>
      )}
    </div>
  );
}
