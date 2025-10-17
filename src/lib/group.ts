import type { Publication } from "@/types/content";

/**
 * Groups publications by year and returns a sorted array of [year, items],
 * with the newest year first.
 */
export function groupPublicationsByYear(
  pubs: Publication[]
): Array<[number, Publication[]]> {
  const buckets = new Map<number, Publication[]>();

  for (const p of pubs) {
    const list = buckets.get(p.year) ?? [];
    list.push(p);
    buckets.set(p.year, list);
  }

  // Convert Map → array and sort years descending
  const grouped = Array.from(buckets.entries()).sort((a, b) => b[0] - a[0]);

  // (Optional) sort within a year, e.g., by title alphabetically
  for (const [, items] of grouped) {
    items.sort((x, y) => x.title.localeCompare(y.title));
  }

  return grouped;
}
