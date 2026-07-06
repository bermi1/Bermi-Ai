import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { companies } from "@/data/companies";
import { group } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { SectorSpotlight } from "@/components/home/SectorSpotlight";
import { SectionHeading } from "@/components/SectionHeading";
import { ValuesSection } from "@/components/ValuesSection";
import { LeadershipStrip } from "@/components/LeadershipStrip";
import { GlobalPresence } from "@/components/GlobalPresence";
import { Partners } from "@/components/Partners";
import { CTABand } from "@/components/CTABand";
import { CompanyCard } from "@/components/CompanyCard";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/button";

export const metadata = pageMeta({
  title: `${group.tradingName} — ${group.tagline}`,
  description: group.positioning,
  path: "/",
});

export default function HomePage() {
  const preview = companies.slice(0, 6);

  return (
    <>
      <Hero />

      {/* Sector spotlight */}
      <section className="container py-20 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Seven sectors, one group"
            title="A conglomerate built for life and business"
            intro="Explore the sectors the group operates across — each one home to companies serving Zanzibar, mainland Tanzania and the Union of Comoros."
          />
        </Reveal>
        <Reveal className="mt-12" delay={0.05}>
          <SectorSpotlight />
        </Reveal>
      </section>

      {/* Companies preview */}
      <section className="bg-sand-100/70 py-20 sm:py-24">
        <div className="container">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Our companies"
              title="Sixteen companies under one roof"
              intro="A preview of the group. Each has its own home within the same unified system."
            />
            <ButtonLink href="/companies" variant="outline">
              View all companies
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </ButtonLink>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {preview.map((company) => (
              <CompanyCard key={company.slug} company={company} />
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <ValuesSection />

      {/* Global presence */}
      <GlobalPresence />

      {/* Leadership */}
      <section className="bg-sand-100/70 py-20 sm:py-24">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Leadership"
              title="Guided by the Turky family"
              intro="Four decades on, the group is led by the next generation of the founding family."
            />
          </Reveal>
          <div className="mt-12">
            <LeadershipStrip />
          </div>
          <Reveal className="mt-10">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-800 hover:text-gold-700"
            >
              Read the group&apos;s story
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Partners & affiliations */}
      <section className="container py-20 sm:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Partners & affiliations"
            title="Trusted by international brands"
            intro="The group's companies operate alongside established international partners across sectors."
          />
        </Reveal>
        <div className="mt-12">
          <Partners />
        </div>
      </section>

      <CTABand />
    </>
  );
}
