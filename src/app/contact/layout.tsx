import type { Metadata } from "next";

import { buildMetadata } from "@/lib/metadata";

/**
 * contact/page.tsx is a client component (it owns form state), and client
 * components cannot export `metadata`. A route layout is the supported way to
 * attach metadata to such a page.
 */
export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with Ekele Ogbadu.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
