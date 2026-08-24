import PublicationItem from "@/components/PublicationItem";
import SectionHeader from "@/components/SectionHeader";
import { publications } from "@/data/research";

export default function FeaturedResearch() {
  const featured = publications.filter((p) => p.featured);
  if (featured.length === 0) return null;

  return (
    <section>
      <SectionHeader
        eyebrow="Publications"
        title="Research"
        description="Peer-reviewed work on grounded language understanding and trustworthy human-robot interaction."
        action={{ href: "/research", label: "All research" }}
      />

      {/* Reuses PublicationItem in compact form — this component used to duplicate
          about forty lines of its markup. */}
      <ul className="divide-y divide-rule border-t border-rule">
        {featured.map((p) => (
          <PublicationItem key={p.slug} pub={p} variant="compact" />
        ))}
      </ul>
    </section>
  );
}
