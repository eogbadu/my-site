import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.author.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social preview card. Generated at build time rather than committed as a PNG so
 * it stays in sync with siteConfig.
 *
 * Deliberately uses only system fonts and inline styles — ImageResponse supports
 * a narrow CSS subset (flex only, no grid) and fetching a webfont here would add
 * a network dependency to the build.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #020617 0%, #0f172a 55%, #164e63 100%)",
          color: "#f8fafc",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#67e8f9",
          }}
        >
          {siteConfig.url.replace("https://", "")}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 700,
            marginTop: 28,
            lineHeight: 1.05,
          }}
        >
          {siteConfig.name}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 40,
            marginTop: 24,
            color: "#cbd5e1",
          }}
        >
          {siteConfig.author.jobTitle} · Researcher
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 27,
            marginTop: 40,
            color: "#94a3b8",
            maxWidth: 900,
          }}
        >
          Trustworthy AI · Computer Vision · Human-Robot Interaction
        </div>
      </div>
    ),
    size
  );
}
