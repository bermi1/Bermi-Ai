import { group, leadership, founders } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import { SectionHeading } from "@/components/SectionHeading";
import { ValuesSection } from "@/components/ValuesSection";
import { StatsBlock } from "@/components/StatsBlock";
import { LeadershipStrip } from "@/components/LeadershipStrip";
import { CTABand } from "@/components/CTABand";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { PageHeader } from "@/components/PageHeader";
import { Timeline } from "@/components/Timeline";
import { Partners } from "@/components/Partners";

export const metadata = pageMeta({
  title: "About the group",
  description: `The story of ${group.tradingName} (${group.legalName}) — from a 1980s Zanzibar tailoring mart to a diversified East African conglomerate of ${group.stats.companies} companies.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="From a tailoring mart to a regional group"
        intro={`${group.legalName}, trading as ${group.tradingName}, has grown over four decades into one of Zanzibar's most diversified family enterprises.`}
      />

      {/* History narrative */}
      <section className="container grid gap-12 py-16 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <SectionHeading eyebrow="Our history" title="Four decades of building" />
          <div className="mt-6 space-y-4 text-ink-600">
            <p>
              In the early 1980s, the Turky family opened a tailoring mart in Zanzibar. What
              began as a single family business became the foundation of a group that now spans
              healthcare, hospitality, real estate, manufacturing, trade, energy and
              communications.
            </p>
            <p>
              Today the group operates {group.stats.companies} companies with a workforce
              historically reported at over {group.stats.employees.toLocaleString()} people,
              across {group.hq.city}, mainland Tanzania and the Union of Comoros — from a 130-bed
              hospital in Stone Town to a grid-scale solar plant in Anjouan.
            </p>
            <p>
              Headquartered on {group.hq.street} in {group.hq.city}, Vigor Group remains a
              family-led enterprise, carrying its founding promise into every sector it enters:
              <em> trusted solutions for life and business.</em>
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <PlaceholderImage
            label="Zanzibar heritage — the group's founding home"
            icon="landmark"
            aspect="aspect-[4/5]"
          />
        </Reveal>
      </section>

      {/* Journey timeline */}
      <section className="bg-sand-100/70 py-16">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Our journey"
              title="From 1980 to today"
              intro="Four decades of growth, told in milestones."
            />
          </Reveal>
          <div className="mt-12 max-w-3xl">
            <Timeline />
          </div>
        </div>
      </section>

      {/* Founders & leadership */}
      <section className="py-16">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Founders & leadership"
              title="The family behind the group"
              intro="The group was founded by the Turky family and is led today by the next generation."
            />
          </Reveal>

          <Reveal className="mt-10 rounded-2xl border border-ink-900/10 bg-white p-8" delay={0.05}>
            <p className="text-ink-600">{founders.intro}</p>
            <RevealGroup className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" as="ul">
              {founders.people.map((p) => (
                <RevealItem
                  as="li"
                  key={p.name}
                  className="rounded-xl bg-sand-100/80 p-4"
                >
                  <p className="font-heading font-semibold text-ink-900">{p.name}</p>
                  <p className="mt-1 text-sm text-ink-600">{p.note}</p>
                </RevealItem>
              ))}
            </RevealGroup>
            <p className="mt-5 text-sm text-ink-500">
              The group remembers the late Yunus Turky and the late Hassan Turky with gratitude
              for the legacy they built.
            </p>
          </Reveal>

          <div className="mt-12">
            <LeadershipStrip withBio />
          </div>
        </div>
      </section>

      {/* Scale stats */}
      <section className="container py-16">
        <StatsBlock />
      </section>

      {/* Values */}
      <ValuesSection />

      {/* Partners */}
      <section className="bg-sand-100/70 py-16">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="Partners & affiliations"
              title="Working with the world"
              intro="Verified partnerships that extend the group's reach across sectors and borders."
            />
          </Reveal>
          <div className="mt-10">
            <Partners />
          </div>
        </div>
      </section>

      <CTABand
        title="Work with a group that's built to last"
        body="Partnerships, supply, careers and investment — start a conversation with Vigor Group."
      />
    </>
  );
}
