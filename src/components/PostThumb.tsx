import Image from "next/image";

/**
 * Listing thumbnail for a post.
 *
 * Uses the same 16:9 ratio, rounded corners and hairline border as ProjectCard,
 * so a post in a list and a project in a grid read as the same visual language
 * rather than two unrelated components.
 *
 * When a post has no cover image it renders a placeholder rather than collapsing:
 * a row that sometimes has an image and sometimes does not looks broken, whereas
 * a consistent block reads as deliberate. The placeholder shows the title's first
 * character in the display serif on the surface ground, quiet enough not to
 * announce a missing asset.
 *
 * Decorative in both cases: the heading beside it already names and links the
 * post, so exposing this too would make screen-reader and keyboard users traverse
 * the same destination twice per row.
 */
export default function PostThumb({
  src,
  title,
  /** Tailwind width classes; the height follows from the 16:9 ratio. */
  width = "w-44 sm:w-56",
  /** Matches `width` so the optimizer fetches a sensibly sized file. */
  sizes = "(min-width: 640px) 224px, 176px",
}: {
  src: string | null;
  title: string;
  width?: string;
  sizes?: string;
}) {
  const initial = title.trim().charAt(0).toUpperCase() || "·";

  return (
    <div
      className={`relative shrink-0 ${width} aspect-video overflow-hidden rounded-lg border border-rule bg-surface`}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
          aria-hidden="true"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center font-display text-3xl text-ink-faint"
        >
          {initial}
        </span>
      )}
    </div>
  );
}
