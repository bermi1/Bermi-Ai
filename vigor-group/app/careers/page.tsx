import { pageMeta } from "@/lib/seo";
import { group } from "@/data/site";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { CareersList } from "@/components/CareersList";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Reveal } from "@/components/motion/Reveal";

export const metadata = pageMeta({
  title: "Careers",
  description: `Build your career across ${group.stats.companies} companies and seven sectors — one place to find roles anywhere in the Vigor Group.`,
  path: "/careers",
});

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="One group, many careers"
        intro={`With over ${group.stats.employees.toLocaleString()} people across ${group.stats.countries} countries, the group offers a single place to find roles anywhere in the family of companies.`}
      />

      <section className="container py-16">
        <Reveal>
          <SectionHeading
            eyebrow="Open roles"
            title="Find your place in the group"
            intro="Sample openings across sectors. Filter by sector, then apply directly."
          />
        </Reveal>
        <div className="mt-10">
          <CareersList />
        </div>
        <p className="mt-8 rounded-xl border border-dashed border-ink-900/15 bg-white/50 p-4 text-sm text-ink-500">
          Listings shown are placeholder samples. Replace them in{" "}
          <code className="rounded bg-ink-900/5 px-1.5 py-0.5 font-mono text-xs">
            data/careers.ts
          </code>{" "}
          or wire this page to an applicant-tracking system.
        </p>
      </section>

      <section className="bg-sand-100/70 py-16">
        <div className="container grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="Don't see a fit?"
              title="Send us an open application"
              intro="Tell us what you do and where you'd like to work in the group. We keep applications on file across all companies."
            />
          </Reveal>
          <Reveal delay={0.05} className="rounded-2xl border border-ink-900/10 bg-white p-6 sm:p-8">
            <EnquiryForm
              subjectPrefix="Open application"
              defaultSubject="Open application"
              showSubject={false}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
