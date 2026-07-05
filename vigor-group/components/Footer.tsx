import Link from "next/link";
import { Mail, MapPin, Phone, Linkedin, Facebook, Instagram } from "lucide-react";
import { group, nav } from "@/data/site";
import { activeSectors, companiesBySector } from "@/data/companies";
import { Wordmark } from "@/components/Wordmark";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-900/10 bg-ink-900 text-sand-100">
      <div className="container grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Wordmark tone="light" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-sand-100/70">
            {group.tagline}. A Zanzibari family group of {group.stats.companies} companies
            across {group.stats.countries} countries.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-sand-100/80">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" strokeWidth={1.6} />
              <span>
                {group.hq.street}, {group.hq.city}
                <br />
                {group.hq.poBox}, {group.hq.country}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-gold-300" strokeWidth={1.6} />
              <a href={`mailto:${group.email}`} className="hover:text-white">
                {group.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-gold-300" strokeWidth={1.6} />
              <a href={`tel:${group.phone.replace(/\s/g, "")}`} className="hover:text-white">
                {group.phone}
              </a>
            </li>
          </ul>
          <div className="mt-6 flex gap-3">
            {[
              { Icon: Linkedin, label: "LinkedIn" },
              { Icon: Facebook, label: "Facebook" },
              { Icon: Instagram, label: "Instagram" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={`${group.tradingName} on ${label}`}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-sand-100/80 transition-colors hover:border-gold-300 hover:text-white"
              >
                <Icon className="h-4 w-4" strokeWidth={1.6} />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-300">
            Explore
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sand-100/80 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-300">
            Our companies
          </h2>
          <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {activeSectors.map((sector) => (
              <div key={sector}>
                <p className="text-sm font-semibold text-white">{sector}</p>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {companiesBySector(sector).map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/companies/${c.slug}`}
                        className="text-sand-100/70 hover:text-white"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-2 py-6 text-xs text-sand-100/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {group.legalName} (trading as {group.tradingName}).
            All rights reserved.
          </p>
          <p>{group.countries.join(" · ")}</p>
        </div>
      </div>
    </footer>
  );
}
