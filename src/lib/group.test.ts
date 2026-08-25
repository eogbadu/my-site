import { describe, expect, it } from "vitest";

import { groupPublicationsByYear } from "./group";
import type { Publication } from "@/types/content";

const pub = (slug: string, year: number, title = slug): Publication => ({
  slug,
  title,
  authors: ["E. Ogbadu"],
  venue: "Venue",
  year,
});

describe("groupPublicationsByYear", () => {
  it("groups by year, newest first", () => {
    const groups = groupPublicationsByYear([
      pub("a", 2024),
      pub("b", 2026),
      pub("c", 2025),
    ]);
    expect(groups.map(([year]) => year)).toEqual([2026, 2025, 2024]);
  });

  it("sorts titles alphabetically within a year", () => {
    const groups = groupPublicationsByYear([
      pub("z", 2026, "Zebra"),
      pub("a", 2026, "Alpha"),
    ]);
    expect(groups[0][1].map((p) => p.title)).toEqual(["Alpha", "Zebra"]);
  });

  it("returns an empty array for no publications", () => {
    expect(groupPublicationsByYear([])).toEqual([]);
  });
});
