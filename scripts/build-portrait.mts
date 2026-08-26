/**
 * Generates portrait treatments from public/avatar.webp.
 *
 *   npx tsx scripts/build-portrait.mts
 *
 * Run once and commit the output; nothing here happens at build or request time.
 * The source is 800x800, so a 4:5 crop trims the sides and keeps full height —
 * no upscaling, no quality loss.
 */
import sharp from "sharp";
import { statSync } from "node:fs";

const SRC = "public/avatar.webp";
const W = 640, H = 800; // 4:5 from an 800x800 source

const base = () =>
  sharp(SRC).extract({ left: Math.round((800 - W) / 2), top: 0, width: W, height: H });

/**
 * Duotone: flatten to luminance, then map that single value onto a line between
 * two brand colours. out_c = lo_c + (hi_c - lo_c) * L/255, which is exactly what
 * sharp's per-channel linear(a, b) computes.
 *
 * This is the treatment that fixes the source photo's real problem: the busy warm
 * background (measured mean RGB 146/119/83) becomes flat brand colour instead of
 * competing patio furniture.
 */
async function duotone(
  lo: [number, number, number],
  hi: [number, number, number]
): Promise<sharp.Sharp> {
  // Round-trip through a buffer so the greyscale result is materialised as three
  // channels. Applying linear() straight after greyscale() fails with "Band
  // expansion using linear is unsupported", because at that point it is 1-band.
  const grey = await base().greyscale().png().toBuffer();
  return sharp(grey)
    .removeAlpha()
    .toColourspace("srgb")
    .linear(
      [(hi[0] - lo[0]) / 255, (hi[1] - lo[1]) / 255, (hi[2] - lo[2]) / 255],
      lo
    );
}

const jobs: Array<[string, sharp.Sharp]> = [
  // A — duotone in the site's teal/ink range
  ["portrait-duotone", await duotone([11, 37, 48], [234, 246, 250])],
  // B — natural, lightly graded, for a full-bleed layout
  ["portrait-natural", base().modulate({ saturation: 0.82 }).linear(1.04, -6)],
  // C — heavily desaturated, for a framed editorial block
  ["portrait-muted", base().modulate({ saturation: 0.28 }).linear(1.06, -8)],
];

for (const [name, pipeline] of jobs) {
  const out = `public/${name}.webp`;
  await pipeline.webp({ quality: 88 }).toFile(out);
  console.log(`  ${out.padEnd(32)} ${(statSync(out).size / 1024).toFixed(0)}KB  ${W}x${H}`);
}
