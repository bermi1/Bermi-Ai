import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { group } from "@/data/site";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrganizationJsonLd } from "@/components/JsonLd";

/**
 * PLACEHOLDER type system (see README > "Brand & design"):
 *   - Fraunces  → confident heritage serif for headings/wordmark
 *   - Inter     → clean geometric sans for body text
 * Replace these with Vigor Group's official typefaces when supplied.
 */
const heading = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(group.url),
  title: {
    default: `${group.tradingName} — ${group.tagline}`,
    template: `%s · ${group.tradingName}`,
  },
  description: group.positioning,
  applicationName: group.tradingName,
  openGraph: {
    type: "website",
    siteName: group.tradingName,
    locale: "en_GB",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="min-h-screen font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-graphite-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <OrganizationJsonLd />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
