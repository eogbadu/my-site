import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Tabs, { type TabItem } from "@/components/Tabs";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "AI/ML engineer, applied researcher, and PhD candidate at UMBC working on multimodal learning and trustworthy human-robot interaction.",
  path: "/about",
});

/**
 * A server component. The tab panels below are rendered here and handed to the
 * client <Tabs> as props, so all of this prose ships as crawlable HTML — the
 * client bundle only carries the toggle. Previously the whole page was
 * "use client", which shipped ~180 lines of static prose as JavaScript and made
 * it impossible to export `metadata` from this file.
 */
const TABS: TabItem[] = [
  {
    id: "overview",
    label: "Overview",
    panel: (
      <>
        <p>
          I like working on problems where language, perception, and
          decision-making intersect. I enjoy taking fuzzy problem statements,
          turning them into clear technical plans, and iterating toward systems
          that are both reliable and useful to real people.
        </p>
        <p>
          My background spans mobile development, web applications, and applied
          machine learning, so I care as much about how something is built and
          deployed as I do about the underlying model.
        </p>
      </>
    ),
  },
  {
    id: "work",
    label: "Work & Style",
    panel: (
      <>
        <h2 className="text-base font-semibold">What I&rsquo;m working on now</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Designing and deploying machine-learning powered features.</li>
          <li>Building internal tools and dashboards to tame messy data.</li>
          <li>Exploring new ideas for AI-assisted productivity and education.</li>
        </ul>

        <h2 className="text-base font-semibold mt-4">How I like to work</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Start from the user and the constraints.</li>
          <li>Prototype quickly, measure honestly, iterate deliberately.</li>
          <li>Keep documentation just good enough that future work is faster.</li>
        </ul>
      </>
    ),
  },
  {
    id: "skills",
    label: "Skills & Tools",
    panel: (
      <>
        <h2 className="text-base font-semibold">Software Languages</h2>
        <p>C/C++ | Python | Rust | JavaScript | Java | HTML | CSS | Bash Linux | COBOL.</p>

        <h2 className="text-base font-semibold mt-3">Frameworks &amp; Tools</h2>
        <p>
          Amazon AWS | TensorFlow | OpenCV | MATLAB | SAS | R | Scikit-learn | ROS |
          MongoDB | MySQL | PostgreSQL | Express | React | Node.js | NumPy | Pandas |
          BeautifulSoup | Matplotlib | Jupyter Notebooks | Google Colab | Gimp |
          Tailwind CSS | FastAPI.
        </p>

        <h2 className="text-base font-semibold mt-3">ML &amp; data</h2>
        <p>
          Model evaluation, prompt and pipeline design, and integrating ML into
          production systems responsibly.
        </p>
      </>
    ),
  },
];

const CROSS_LINKS = [
  { href: "/projects", label: "View projects" },
  { href: "/research", label: "See research" },
  { href: "/resume", label: "Resume overview" },
];

export default function AboutPage() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-start md:gap-10">
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">About Me</h1>

          <p className="text-ink-muted">
            I&rsquo;m an AI/ML engineer, applied researcher, and PhD candidate at the
            University of Maryland, Baltimore County, where my work focuses on
            multimodal learning and trustworthy human-robot interaction. My research
            explores how large language models interpret grounded instructions —
            integrating text, visual context, and sensor signals to help robots
            understand what humans mean, not just what they say.
          </p>

          <p className="text-ink-muted">
            I currently serve as a <strong>Lead AI/ML Engineer</strong> at Booz Allen
            Hamilton, where I lead AI/ML training, tool development, and platform
            enablement, and design LLM-enabled and RAG-style workflows for tagging,
            semantic retrieval, and knowledge discovery. Before this I built the team&rsquo;s
            ontology-driven tagging pipeline end to end, and prior to that spent a year as
            a Senior Agile Engineer and Release Manager on a $200M program, where I cut
            average days-to-completion from 167 to 36 and blocked-release time from 250
            days to zero.
          </p>

          <p className="text-ink-muted">
            Before graduate school, I built and shipped several real-world systems across
            mobile development, web engineering, and data-driven products. I&rsquo;ve
            always enjoyed projects where clean engineering, thoughtful design, and
            tangible impact come together.
          </p>

          <p className="text-ink-muted">
            Today, my focus is split across three areas: developing data-efficient
            multimodal models for robotics and autonomous systems; building AI-driven
            productivity tools, including TimeSense; and designing reliable ML pipelines
            that move ideas from prototype to production. I enjoy solving ambiguous
            problems, turning research insights into practical solutions, and creating
            tools that make people more capable.
          </p>
        </div>

        <div className="mt-6 md:mt-[52px] flex-shrink-0 flex justify-center md:justify-end">
          <div className="relative h-[650px] w-[400px] max-w-full overflow-hidden rounded-3xl border border-rule bg-surface shadow-lg">
            <Image
              src={siteConfig.avatar}
              alt={siteConfig.name}
              fill
              // Without `sizes`, `fill` makes the browser assume 100vw and fetch a
              // far larger variant than this 400px-wide box needs.
              sizes="(min-width: 768px) 400px, 100vw"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <Tabs tabs={TABS} label="About me sections" />

      <div className="flex flex-wrap gap-3 text-sm">
        {CROSS_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="inline-flex items-center rounded-2xl border border-rule px-3 py-1.5 hover:bg-surface focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
