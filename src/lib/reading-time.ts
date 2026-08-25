/** Rough reading time in minutes. 200 wpm is the usual convention. */
export function readingTime(source: string): number {
  const words = source.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
