import Link from "next/link";
import { partners } from "@/data/site";
import { Icon } from "@/components/Icon";
import { sectorMeta } from "@/data/site";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

/** Partners & affiliations — verified relationships from company notes. */
export function Partners() {
  return (
    <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" as="ul">
      {partners.map((p) => (
        <RevealItem as="li" key={p.name}>
          <Link
            href={`/companies/${p.companySlug}`}
            className="group flex h-full flex-col rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card transition-shadow hover:shadow-lift"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-800/8 text-ink-700 transition-colors group-hover:bg-gold-100 group-hover:text-gold-700">
              <Icon name={sectorMeta[p.sector].icon} className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-heading text-base font-semibold text-ink-900">
              {p.name}
            </h3>
            <p className="mt-1.5 text-sm text-ink-600">{p.relation}</p>
          </Link>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
