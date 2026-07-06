import { ArrowRight } from "lucide-react";
import { companies } from "@/data/companies";
import { group } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { SectorSpotlight } from "@/components/home/SectorSpotlight";
import { SectionHeading } from "@/components/SectionHeading";
import { StatsBlock } from "@/components/StatsBlock";
import { CTABand } from "@/components/CTABand";
import { CompanyCard } from "@/components/CompanyCard";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/button";

export const metadata = pageMeta({
  title: `${group.tradingName} — ${group.tagline}`,
  description: group.positioning,
  path: "/",
});

/**
 * Deliberately minimal landing: one statement (hero), one interactive moment
 * (sector spotlight), one proof (companies), one scale beat (stats), one ask
 * (CTA). Mission, values, leadership and partners live on /about.
 */
export default function HomePage() {
  const preview = companies.slice(0, 6);

  return (
    <>
      <Hero />

      {/* Sectors */}
      <section className="container py-24 sm:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="What we do"
            title="One group. Every sector that matters."
          />
        </Reveal>
        <Reveal className="mt-12" delay={0.05}>
          <SectorSpotlight />
        </Reveal>
      </section>

      {/* Companies */}
      <section className="border-y border-graphite-100 bg-graphite-50/60 py-24 sm:py-32">
        <div className="container">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Our companies"
              title="Built by family. Run like the future."
            />
            <ButtonLink href="/companies" variant="outline">
              All {group.stats.companies} companies
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

      {/* Scale */}
      <section className="container py-24 sm:py-32">
        <StatsBlock />
      </section>

      <CTABand
        title="Let's build something together"
        body="Customers, partners, investors and future colleagues — one message reaches the whole group."
      />
    </>
  );
}
