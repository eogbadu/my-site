import type { Metadata } from "next";

import { buildMetadata } from "@/lib/metadata";

/**
 * about/page.tsx is currently a client component (it owns tab state), so it
 * cannot export `metadata`. This layout supplies it in the meantime; Phase 6
 * converts the page back to a server component by extracting the tabs.
 */
export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "AI/ML engineer, applied researcher, and PhD candidate at UMBC working on multimodal learning and trustworthy human-robot interaction.",
  path: "/about",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
