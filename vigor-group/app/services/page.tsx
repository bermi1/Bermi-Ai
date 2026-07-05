import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { serviceCategories } from "@/data/site";
import { getCompany } from "@/data/companies";
import { pageMeta } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { SectionHeading } from "@/components/SectionHeading";
import { Icon } from "@/components/Icon";
import { CTABand } from "@/components/CTABand";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export const metadata = pageMeta({
  title: "Products & services",
  description:
    "Find what you need by category — healthcare, hospitality, real estate, manufacturing, trade, energy, communications and automotive — across the whole Vigor Group.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Products & services"
        title="Find us by what you need"
        intro="Search the group by need, not by which company owns it. Every category links straight to the companies that serve it."
      />

      <section className="container py-16">
        <Reveal>
          <SectionHeading
            eyebrow="Categories"
            title="Eight ways the group can help"
            intro="From a hospital bed to a bag of cement, a hotel room to a solar connection — the group's services span daily life and business."
          />
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2" as="ul">
          {serviceCategories.map((cat) => {
            const linked = cat.companySlugs
              .map((slug) => getCompany(slug))
              .filter((c): c is NonNullable<typeof c> => Boolean(c));
            return (
              <RevealItem
                as="li"
                key={cat.title}
                className="flex flex-col rounded-2xl border border-ink-900/10 bg-white p-7 shadow-card"
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold-100 text-gold-700">
                    <Icon name={cat.icon} className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-ink-900">
                      {cat.title}
                    </h3>
                    <p className="mt-1 text-sm text-ink-600">{cat.description}</p>
                  </div>
                </div>

                <ul className="mt-5 flex flex-1 flex-col gap-2 border-t border-ink-900/8 pt-5">
                  {linked.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/companies/${c.slug}`}
                        className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm text-ink-700 transition-colors hover:bg-sand-100"
                      >
                        <span className="font-medium">{c.name}</span>
                        <ArrowRight
                          className="h-4 w-4 text-gold-600 transition-transform group-hover:translate-x-0.5"
                          strokeWidth={1.8}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      <CTABand
        title="Not sure which company to ask?"
        body="Send the group one message and we'll route you to the right team."
        primary={{ href: "/contact", label: "Ask the group" }}
        secondary={{ href: "/companies", label: "Browse companies" }}
      />
    </>
  );
}
