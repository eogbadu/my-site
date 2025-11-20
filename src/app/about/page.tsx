"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type TabId = "overview" | "work" | "skills";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "work", label: "Work & Style" },
  { id: "skills", label: "Skills & Tools" },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Top: intro + photo */}
      <div className="flex flex-col md:flex-row md:items-start md:gap-10">
        <div className="flex-1 space-y-4 text-justify hyphens-auto">
          <h1 className="text-3xl font-bold tracking-tight">About Me</h1>

          <p className="text-slate-600 dark:text-slate-300">
            I’m an AI/ML engineer, applied researcher, and PhD candidate at the
            University of Maryland, Baltimore County, where my work focuses on
            multimodal learning and trustworthy human-robot interaction. My
            research explores how large language models interpret grounded
            instructions—integrating text, visual context, and sensor signals to
            help robots understand what humans mean, not just what they say.
          </p>

          <p className="text-slate-600 dark:text-slate-300">
            I currently serve as a <strong>Senior AI/ML Engineer</strong> at
            Booz Allen Hamilton in a cleared role, where I design and support
            machine-learning capabilities for high-impact programs. My work
            spans model evaluation, data pipelines, automation, and applied ML
            system design. Before transitioning into this role, I spent a year
            as a Senior Agile Engineer and Release Manager, coordinating complex
            software releases across multiple systems and leading initiatives
            that improved operational efficiency and delivery reliability.
          </p>

          <p className="text-slate-600 dark:text-slate-300">
            Before graduate school, I built and shipped several real-world
            systems across mobile development, web engineering, and data-driven
            products. I’ve always enjoyed projects where clean engineering,
            thoughtful design, and tangible impact come together.
          </p>

          <p className="text-slate-600 dark:text-slate-300">
            Today, my focus is split across three areas: developing
            data-efficient multimodal models for robotics and autonomous
            systems; building AI-driven productivity tools, including my
            ResumeTailor platform; and designing reliable ML pipelines that move
            ideas from prototype to production. I enjoy solving ambiguous
            problems, turning research insights into practical solutions, and
            creating tools that make people more capable.
          </p>
        </div>

        {/* Big rectangular image */}
        <div className="mt-6 md:mt-[52px] flex-shrink-0 flex justify-center md:justify-end">
          <div className="relative h-[650px] w-[400px] max-w-full overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-lg">
            <Image
              src="/avatar.png" // put your actual 650x500 image here
              alt="Portrait"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Tabs + content */}
      <div className="space-y-6">
        {/* Tab buttons */}
        <div className="inline-flex rounded-full border border-slate-200 dark:border-slate-800 p-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab panel */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-6 space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
          {activeTab === "overview" && (
            <>
              <p>
                I like working on problems where language, perception, and
                decision-making intersect. I enjoy taking fuzzy problem
                statements, turning them into clear technical plans, and
                iterating toward systems that are both reliable and useful to
                real people.
              </p>
              <p>
                My background spans mobile development, web applications, and
                applied machine learning, so I care as much about how something
                is built and deployed as I do about the underlying model.
              </p>
            </>
          )}

          {activeTab === "work" && (
            <>
              <h2 className="text-base font-semibold">
                What I’m working on now
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Designing and deploying machine-learning powered features.
                </li>
                <li>
                  Building internal tools and dashboards to tame messy data.
                </li>
                <li>
                  Exploring new ideas for AI-assisted productivity and
                  education.
                </li>
              </ul>

              <h2 className="text-base font-semibold mt-4">
                How I like to work
              </h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Start from the user and the constraints.</li>
                <li>
                  Prototype quickly, measure honestly, iterate deliberately.
                </li>
                <li>
                  Keep documentation just good enough that future work is
                  faster.
                </li>
              </ul>
            </>
          )}

          {activeTab === "skills" && (
            <>
              <h2 className="text-base font-semibold">
                Software Languages
              </h2>
              <p>
                C/C++ | Python | Rust | JavaScript | Java | HTML | CSS | Bash Linux | COBOL.
              </p>

              <h2 className="text-base font-semibold mt-3">
                Frameworks &amp; Tools
              </h2>
              <p>
                Amazon AWS | TensorFlow | OpenCV | MATLAB | SAS | R | Scikit-learn | ROS | MongoDB | 
                MySQL | PostgresSQL | Express | React | Node.js | NumPy | Pandas | BeautifulSoup | 
                Matplotlib | Jupyter Notebooks | Google Colab | Gimp | Tailwind CSS | FastAPI.
              </p>

              <h2 className="text-base font-semibold mt-3">ML &amp; data</h2>
              <p>
                Model evaluation, prompt and pipeline design, and integrating ML
                into production systems responsibly.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Small cross-links at the bottom */}
      <div className="flex flex-wrap gap-3 text-sm">
        <Link
          href="/projects"
          className="inline-flex items-center rounded-2xl border border-slate-200 dark:border-slate-800 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-900"
        >
          View projects
        </Link>
        <Link
          href="/research"
          className="inline-flex items-center rounded-2xl border border-slate-200 dark:border-slate-800 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-900"
        >
          See research
        </Link>
        <Link
          href="/resume"
          className="inline-flex items-center rounded-2xl border border-slate-200 dark:border-slate-800 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-900"
        >
          Resume overview
        </Link>
      </div>
    </section>
  );
}
