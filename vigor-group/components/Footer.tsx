import Link from "next/link";
import { Linkedin, Facebook, Instagram } from "lucide-react";
import { group, nav } from "@/data/site";
import { Wordmark } from "@/components/Wordmark";

/**
 * Minimalist footer — wordmark, one line, nav, contact, socials. The full
 * company directory lives on /companies, not here.
 */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-graphite-200 bg-white">
      <div className="container py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Wordmark tone="ink" />
            <p className="mt-4 text-sm leading-relaxed text-graphite-500">
              {group.tagline}.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-7 gap-y-3 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-graphite-600 transition-colors hover:text-graphite-950"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col items-start gap-4">
            <a
              href={`mailto:${group.email}`}
              className="text-sm font-medium text-graphite-950 underline-offset-4 transition-colors hover:text-brand-600 hover:underline"
            >
              {group.email}
            </a>
            <div className="flex gap-2">
              {[
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Instagram, label: "Instagram" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={`${group.tradingName} on ${label}`}
                  className="grid h-9 w-9 place-items-center rounded-full text-graphite-400 transition-colors hover:bg-graphite-100 hover:text-graphite-900"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.6} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-graphite-100 pt-6 text-xs text-graphite-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {group.legalName}, trading as {group.tradingName}.
          </p>
          <p>
            {group.hq.street}, {group.hq.city} · {group.countries.join(" · ")}
          </p>
        </div>
      </div>
    </footer>
  );
}
