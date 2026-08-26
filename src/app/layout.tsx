import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";

/**
 * These `variable` names are what globals.css maps `--font-sans` / `--font-mono`
 * to inside its `@theme inline` block. Before this, those CSS variables were
 * referenced but never defined, so the site silently rendered in Arial.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Display face for headings. The typographic contrast between a high-contrast
 * serif and a geometric sans is what stops the site reading as a default
 * template — and a serif carries the scholarly register the research audience
 * responds to, which a single sans cannot.
 */
const displaySerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  // Makes every relative URL below (and in child pages) resolve against the
  // canonical www origin. Without it, Next emits relative OG urls that crawlers
  // and link unfurlers cannot resolve.
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  alternates: { canonical: "/" },

  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // The inline script below mutates this element before React hydrates.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable}`}
    >
      <head>
        {/*
          Render-blocking on purpose: it must run before first paint, or every
          dark-mode visitor sees a white flash. Kept tiny and wrapped in try/catch
          so a disabled-storage browser degrades to system preference rather than
          throwing before the page renders.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=document.documentElement;if(t==='dark'||t==='light'){d.setAttribute('data-theme',t);d.style.colorScheme=t}else{d.style.colorScheme='light dark'}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased bg-paper text-ink">
        {/*
          Skip link: the first thing a keyboard or screen-reader user reaches, so
          they can jump past the nav. Visually hidden until focused.
        */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]
                     focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-sm
                     focus:font-semibold focus:text-paper focus:outline-none focus:ring-2
                     focus:ring-accent"
        >
          Skip to content
        </a>

        <Navbar />
        {/* scroll-mt offsets the sticky header when jumping to #main */}
        <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-5 sm:px-8 py-12 sm:py-16 scroll-mt-24">
          {children}
        </main>
        <Footer />

        {/*
          Cookieless, so no consent banner is required. Speed Insights reports
          real-user Core Web Vitals, which is how the image and `priority` work
          gets verified against actual visitors rather than a local Lighthouse run.

          Both need enabling in the Vercel dashboard — installing the packages
          alone does nothing. See docs/RUNBOOK.md H7.
        */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
