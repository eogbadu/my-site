import { describe, expect, it } from "vitest";

import { slugToLabel, tagToSlug } from "./tags";

describe("tagToSlug", () => {
  it("lowercases and hyphenates", () => {
    expect(tagToSlug("Trustworthy AI")).toBe("trustworthy-ai");
  });

  it("collapses runs of non-alphanumerics into one hyphen", () => {
    expect(tagToSlug("Vision — Language")).toBe("vision-language");
    expect(tagToSlug("a  b   c")).toBe("a-b-c");
  });

  it("trims leading and trailing separators", () => {
    expect(tagToSlug("  !Robotics!  ")).toBe("robotics");
  });

  it("is idempotent — re-slugging a slug is a no-op", () => {
    const once = tagToSlug("Human-Robot Interaction");
    expect(tagToSlug(once)).toBe(once);
  });
});

describe("slugToLabel", () => {
  it("title-cases each hyphen-separated word", () => {
    expect(slugToLabel("grounded-language")).toBe("Grounded Language");
  });

  /**
   * Documents why the database stores tags AND tag_slugs rather than recovering
   * labels from slugs: this round-trip is lossy and always will be.
   */
  it("does NOT round-trip acronyms or punctuation", () => {
    expect(slugToLabel(tagToSlug("Trustworthy AI"))).toBe("Trustworthy Ai");
    expect(slugToLabel(tagToSlug("Human-Robot Interaction"))).not.toBe(
      "Human-Robot Interaction"
    );
  });
});
