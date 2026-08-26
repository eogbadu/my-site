import { describe, expect, it } from "vitest";

import { firstImageFrom } from "./first-image";

describe("firstImageFrom", () => {
  it("finds a markdown image", () => {
    expect(firstImageFrom("text\n\n![a photo](https://x.test/a.png)\n")).toBe(
      "https://x.test/a.png"
    );
  });

  it("finds a raw <img> tag", () => {
    expect(firstImageFrom('<img src="https://x.test/b.webp" alt="" />')).toBe(
      "https://x.test/b.webp"
    );
  });

  it("returns the first of several", () => {
    const body = "![one](https://x.test/1.png)\n\n![two](https://x.test/2.png)";
    expect(firstImageFrom(body)).toBe("https://x.test/1.png");
  });

  it("prefers markdown over a later html tag", () => {
    const body = '![md](https://x.test/md.png)\n<img src="https://x.test/html.png">';
    expect(firstImageFrom(body)).toBe("https://x.test/md.png");
  });

  it("strips a markdown title attribute", () => {
    expect(firstImageFrom('![a](https://x.test/c.png "a caption")')).toBe(
      "https://x.test/c.png"
    );
  });

  it("returns null when there is no image", () => {
    expect(firstImageFrom("Just prose, and a [link](https://x.test).")).toBeNull();
    expect(firstImageFrom("")).toBeNull();
  });

  /** A <video> poster is not something the listing can render as a thumbnail. */
  it("ignores video sources", () => {
    const body = '<video controls><source src="https://x.test/v.mp4" /></video>';
    expect(firstImageFrom(body)).toBeNull();
  });

  it("does not mistake a plain link for an image", () => {
    expect(firstImageFrom("[not an image](https://x.test/a.png)")).toBeNull();
  });
});
