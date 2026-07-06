import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { companies } from "@/data/companies";
import { group } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { SectorSpotlight } from "@/components/home/SectorSpotlight";
import { SectionHeading } from "@/components/SectionHeading";
import { ValuesSection } from "@/components/ValuesSection";
import { DivisionHeads } from "@/components/DivisionHeads";
import { GlobalPresence } from "@/components/GlobalPresence";
import { Partners } from "@/components/Partners";
import { MissionVision } from "@/components/MissionVision";
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
            eyebrow={`${group.stats.sectors} sectors, one group`}
            title="A conglomerate built for life and business"
            intro="Explore the sectors the group operates across — each one home to companies serving Zanzibar, mainland Tanzania and the Union of Comoros."
          />
        </Reveal>
        <Reveal className="mt-12" delay={0.05}>
          <SectorSpotlight />
        </Reveal>
      </section>

      {/* Mission & vision */}
      <section className="bg-graphite-100/70 py-20 sm:py-24">
        <div className="container">
          <Reveal>
            <SectionHeading
              align="center"
              className="mx-auto"
              eyebrow="Who we are"
              title="Serving people, serving nations"
              intro={group.positioningShort}
            />
          </Reveal>
          <div className="mt-12">
            <MissionVision />
          </div>
        </div>
      </section>

      {/* Companies preview */}
      <section className="py-20 sm:py-24">
        <div className="container">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Our companies"
              title={`${group.stats.companies} companies under one roof`}
              intro="A preview of the group. Each has its own home — and its own identity — within the same unified system."
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

      {/* Leadership & division heads */}
      <section className="bg-graphite-100/70 py-20 sm:py-24">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Leadership"
              title="The people behind every division"
              intro="Guided by the Turky family since 1980 — with a dedicated head for each business division, each carrying their division's colours."
            />
          </Reveal>
          <div className="mt-12">
            <DivisionHeads />
          </div>
          <Reveal className="mt-10">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-graphite-800 hover:text-brand-700"
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
