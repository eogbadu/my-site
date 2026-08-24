import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { publications } from "@/data/research";
import { groupPublicationsByYear } from "@/lib/group";
import PublicationItem from "@/components/PublicationItem";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = buildMetadata({
  title: "Research",
  description:
    "Publications and works in progress on trustworthy AI, vision-language models, and human-robot interaction.",
  path: "/research",
});

export default function ResearchPage() {
  const groups = groupPublicationsByYear(publications);

  return (
    <section>
      <SectionHeader
        as="h1"
        eyebrow="Publications"
        title="Research"
        description="Peer-reviewed work and works in progress on multimodal grounding, trustworthy AI, and human-robot interaction."
      />

      <div className="space-y-12">
        {groups.map(([year, items]) => (
          <section key={year}>
            <h2 className="numeral pb-2 border-b border-rule">{year}</h2>
            <ul className="divide-y divide-rule">
              {items.map((p) => (
                <PublicationItem key={p.slug} pub={p} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
