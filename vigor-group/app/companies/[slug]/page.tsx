import { notFound } from "next/navigation";
import { ArrowUpRight, Check, ExternalLink } from "lucide-react";
import { getCompany, allSlugs, companiesBySector } from "@/data/companies";
import { sectorMeta, group } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import { Icon } from "@/components/Icon";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { CompanyCard } from "@/components/CompanyCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const company = getCompany(params.slug);
  if (!company) return {};
  return pageMeta({
    title: company.name,
    description: `${company.description} A ${company.sector.toLowerCase()} company, part of ${group.tradingName}.`,
    path: `/companies/${company.slug}`,
  });
}

export default function CompanyPage({ params }: { params: { slug: string } }) {
  const company = getCompany(params.slug);
  if (!company) notFound();

  const meta = sectorMeta[company.sector];
  const cta = meta.cta;
  const mailHref = `mailto:${group.email}?subject=${encodeURIComponent(
    `${cta.label} — ${company.name}`,
  )}`;
  const related = companiesBySector(company.sector)
    .filter((c) => c.slug !== company.slug)
    .slice(0, 3);

  return (
    <>
      {/* Company hero — shared shell, tinted with this unit's accent colour */}
      <section className="relative isolate overflow-hidden bg-graphite-950 text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `linear-gradient(135deg, ${meta.color}26, #111114 60%)` }}
          />
          <div
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
            style={{ backgroundColor: `${meta.color}40` }}
          />
        </div>
        {/* top accent bar in the unit colour */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1" style={{ backgroundColor: meta.color }} />
        <div className="container grid gap-10 pb-16 pt-32 sm:pt-40 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Breadcrumbs
              items={[
                { href: "/", label: "Home" },
                { href: "/companies", label: "Companies" },
                { label: company.name },
              ]}
            />
            <div className="mt-6 flex items-center gap-3">
              <span
                className="grid h-12 w-12 place-items-center rounded-xl text-white"
                style={{ backgroundColor: `${meta.color}33` }}
              >
                <Icon name={meta.icon} className="h-6 w-6" />
              </span>
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: meta.color }}
              >
                {meta.label}
              </span>
            </div>
            <h1 className="mt-5 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
              {company.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-graphite-100/80">{company.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                href={mailHref}
                size="lg"
                className="text-white"
                style={{ backgroundColor: meta.color }}
              >
                {cta.label}
                <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
              </ButtonLink>
              {company.externalUrl && (
                <ButtonLink
                  href={company.externalUrl}
                  variant="onDark"
                  size="lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit site
                  <ExternalLink className="h-4 w-4" strokeWidth={1.8} />
                </ButtonLink>
              )}
            </div>
          </div>
          <div>
            <PlaceholderImage
              label={`${company.name} — ${meta.label}`}
              icon={meta.icon}
              aspect="aspect-[5/4]"
              color={meta.color}
            />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">
            About {company.name}
          </span>
          <div className="mt-4 space-y-4 text-graphite-600">
            <p>{company.description}</p>
            {company.notes && <p>{company.notes}</p>}
            <p>
              {company.name} operates as part of {group.tradingName} ({group.legalName}), a
              family group of {group.stats.companies} companies. Content on this page is drawn
              from the group&apos;s verified company data; richer detail and imagery will follow as
              the company supplies it.
            </p>
          </div>

          {company.offerings && company.offerings.length > 0 && (
            <div className="mt-10">
              <h2 className="font-heading text-xl font-semibold text-graphite-900">
                Services &amp; products
              </h2>
              <RevealGroup className="mt-5 grid gap-3 sm:grid-cols-2" as="ul">
                {company.offerings.map((o) => (
                  <RevealItem
                    as="li"
                    key={o}
                    className="flex items-center gap-3 rounded-xl border border-graphite-900/10 bg-white p-4"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-100 text-brand-700">
                      <Check className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="text-sm text-graphite-700">{o}</span>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          )}
        </div>

        {/* Aside */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-graphite-900/10 bg-white p-6 shadow-card">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-800">
              Part of Vigor Group
            </span>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-graphite-500">Sector</dt>
                <dd className="mt-0.5 flex items-center gap-2 font-medium text-graphite-900">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  {meta.label}
                </dd>
              </div>
              {company.country && (
                <div>
                  <dt className="text-graphite-500">Location</dt>
                  <dd className="mt-0.5 font-medium text-graphite-900">{company.country}</dd>
                </div>
              )}
              <div>
                <dt className="text-graphite-500">Group</dt>
                <dd className="mt-0.5 font-medium text-graphite-900">{group.tradingName}</dd>
              </div>
            </dl>
            <div className="mt-6 border-t border-graphite-900/8 pt-5">
              <ButtonLink
                href={mailHref}
                className="w-full text-white"
                style={{ backgroundColor: meta.color }}
              >
                {cta.label}
              </ButtonLink>
            </div>
          </div>
        </aside>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-graphite-100/70 py-16">
          <div className="container">
            <Reveal>
              <h2 className="font-heading text-2xl font-semibold text-graphite-900">
                More in {company.sector}
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <CompanyCard key={c.slug} company={c} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
