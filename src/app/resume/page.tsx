import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { resume } from "@/data/resume";
import ResumeActions from "@/components/ResumeActions";

export const metadata: Metadata = buildMetadata({
  title: "Resume",
  description:
    "Experience, education, and technical proficiencies of Ekele Ogbadu, AI/ML Engineer and researcher.",
  path: "/resume",
});

export default function ResumePage() {
  return (
    <section className="space-y-8 print:space-y-6">
      <header className="space-y-2 print:space-y-1">
        <h1 className="text-3xl font-bold print:text-2xl">{resume.name}</h1>
        {resume.tagline && (
          <p className="text-ink-muted">{resume.tagline}</p>
        )}
        {resume.summary && (
          <p className="text-ink-muted max-w-prose text-justify hyphens-auto">
            {resume.summary}
          </p>
        )}

        <ResumeActions />
      </header>

      <div className="space-y-8 print:space-y-4">
        {resume.sections.map((section) => (
          <section
            key={section.heading}
            className="space-y-4 break-inside-avoid"
          >
            <h2 className="text-2xl font-semibold print:text-xl">
              {section.heading}
            </h2>
            <ul className="space-y-4">
              {section.items.map((item, idx) => (
                <li
                  key={item.title + idx}
                  className="rounded-2xl border border-rule p-4 print:border-0 print:p-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      {(item.org || item.location) && (
                        <p className="text-sm text-ink-muted">
                          {[item.org, item.location]
                            .filter(Boolean)
                            .join(" — ")}
                        </p>
                      )}
                    </div>
                    {item.period && (
                      <span className="text-xs text-ink-faint">
                        {item.period}
                      </span>
                    )}
                  </div>

                  {item.bullets && item.bullets.length > 0 && (
                    <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-ink-muted print:mt-2">
                      {item.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
