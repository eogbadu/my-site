/**
 * Finds the first image referenced in a post body.
 *
 * Lets a cover image be implicit: dropping an image into a post is enough to give
 * it a listing thumbnail, with no second step to set the same URL again. An
 * explicit cover still wins, so a post can lead with a different image than the
 * one it opens with.
 *
 * Handles both forms the editor produces — markdown `![alt](url)` and raw
 * `<img src="url">` — and ignores video, since a <video> poster is not an image
 * the listing can show directly.
 */
const MARKDOWN_IMAGE = /!\[[^\]]*\]\(\s*(\S+?)(?:\s+["'][^"']*["'])?\s*\)/;
const HTML_IMAGE = /<img[^>]+src=["']([^"']+)["']/i;

export function firstImageFrom(body: string): string | null {
  const md = body.match(MARKDOWN_IMAGE)?.[1];
  if (md) return md;

  const html = body.match(HTML_IMAGE)?.[1];
  if (html) return html;

  return null;
}
