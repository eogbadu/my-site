import { publications } from "@/data/research";
import { groupPublicationsByYear } from "@/lib/group";
import PublicationItem from "@/components/PublicationItem";

export default function ResearchPage() {
  const groups = groupPublicationsByYear(publications);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Research</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-prose">
          Selected publications and works in progress, grouped by year.
        </p>
      </header>

      <div className="space-y-10">
        {groups.map(([year, items]) => (
          <section key={year} className="space-y-4">
            <h2 className="text-2xl font-semibold">{year}</h2>
            <ul className="space-y-6">
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
