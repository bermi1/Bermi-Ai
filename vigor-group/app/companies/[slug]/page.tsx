import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, ExternalLink } from "lucide-react";
import { getCompany, allSlugs, companiesBySector } from "@/data/companies";
import { sectorMeta, group } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import { Icon } from "@/components/Icon";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { CompanyCard } from "@/components/CompanyCard";
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
      {/* Company hero — shared shell, sector-tinted */}
      <section className="relative isolate overflow-hidden bg-ink-900 text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-ink-800 to-ink-950" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl" />
        </div>
        <div className="container grid gap-10 pb-16 pt-32 sm:pt-40 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Link
              href="/companies"
              className="inline-flex items-center gap-1.5 text-sm text-sand-100/70 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.8} /> All companies
            </Link>
            <div className="mt-6 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-gold-200">
                <Icon name={meta.icon} className="h-6 w-6" />
              </span>
              <Badge tone="gold">{company.sector}</Badge>
            </div>
            <h1 className="mt-5 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
              {company.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-sand-100/80">{company.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={mailHref} variant="gold" size="lg">
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
              label={`${company.name} — ${company.sector}`}
              icon={meta.icon}
              aspect="aspect-[5/4]"
            />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-700">
            About {company.name}
          </span>
          <div className="mt-4 space-y-4 text-ink-600">
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
              <h2 className="font-heading text-xl font-semibold text-ink-900">
                Services &amp; products
              </h2>
              <RevealGroup className="mt-5 grid gap-3 sm:grid-cols-2" as="ul">
                {company.offerings.map((o) => (
                  <RevealItem
                    as="li"
                    key={o}
                    className="flex items-center gap-3 rounded-xl border border-ink-900/10 bg-white p-4"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold-100 text-gold-700">
                      <Check className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="text-sm text-ink-700">{o}</span>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          )}
        </div>

        {/* Aside */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-800">
              Part of Vigor Group
            </span>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-ink-500">Sector</dt>
                <dd className="mt-0.5 font-medium text-ink-900">{company.sector}</dd>
              </div>
              <div>
                <dt className="text-ink-500">Group</dt>
                <dd className="mt-0.5 font-medium text-ink-900">{group.tradingName}</dd>
              </div>
              <div>
                <dt className="text-ink-500">Headquarters</dt>
                <dd className="mt-0.5 font-medium text-ink-900">
                  {group.hq.city}, {group.hq.country}
                </dd>
              </div>
            </dl>
            <div className="mt-6 border-t border-ink-900/8 pt-5">
              <ButtonLink href={mailHref} variant="primary" className="w-full">
                {cta.label}
              </ButtonLink>
            </div>
          </div>
        </aside>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-sand-100/70 py-16">
          <div className="container">
            <Reveal>
              <h2 className="font-heading text-2xl font-semibold text-ink-900">
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
