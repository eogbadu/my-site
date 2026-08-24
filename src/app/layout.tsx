import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen font-sans bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {/*
          Skip link: the first thing a keyboard or screen-reader user reaches, so
          they can jump past the nav. Visually hidden until focused.
        */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]
                     focus:rounded-xl focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm
                     focus:font-semibold focus:text-white focus:outline-none focus:ring-2
                     focus:ring-slate-400 dark:focus:bg-slate-50 dark:focus:text-slate-900"
        >
          Skip to content
        </a>

        <Navbar />
        {/* scroll-mt offsets the sticky header when jumping to #main */}
        <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-8 scroll-mt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
