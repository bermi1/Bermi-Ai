import Image from "next/image";
import { Mail, Linkedin, User } from "lucide-react";
import { divisionHeads, sectorMeta, leadership, group } from "@/data/site";
import { Icon } from "@/components/Icon";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

/**
 * Group executives + one head card per business division.
 * Each card carries its division's accent colour, a photo slot, the role,
 * and contact links. Division-head names render as "to be announced" until
 * supplied in data/site.ts — no invented people.
 */
export function DivisionHeads() {
  return (
    <div className="space-y-10">
      {/* Group executives (verified) */}
      <RevealGroup className="grid gap-6 sm:grid-cols-3" as="ul">
        {leadership.map((person) => (
          <RevealItem
            as="li"
            key={person.name}
            className="group relative overflow-hidden rounded-2xl border border-graphite-900/10 bg-graphite-900 text-white shadow-card transition-shadow hover:shadow-lift"
          >
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-brand-600" />
            <div className="p-7">
              <span
                role="img"
                aria-label={`Photo placeholder: ${person.name}`}
                className="grid h-20 w-20 place-items-center rounded-2xl bg-white/10 text-brand-300"
              >
                <User className="h-9 w-9" strokeWidth={1.4} />
              </span>
              <h3 className="mt-5 font-heading text-xl font-semibold">{person.name}</h3>
              <p className="mt-1 text-sm font-medium text-brand-300">{person.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{person.bio}</p>
              <div className="mt-5 flex gap-2">
                <a
                  href={`mailto:${group.email}?subject=${encodeURIComponent(`Attn: ${person.name} (${person.title})`)}`}
                  aria-label={`Email the office of ${person.name}`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-brand-400 hover:text-white"
                >
                  <Mail className="h-4 w-4" strokeWidth={1.7} />
                </a>
                <a
                  href="#"
                  aria-label={`${person.name} on LinkedIn (link pending)`}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-brand-400 hover:text-white"
                >
                  <Linkedin className="h-4 w-4" strokeWidth={1.7} />
                </a>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Division heads */}
      <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" as="ul">
        {divisionHeads.map((head) => {
          const meta = sectorMeta[head.sector];
          return (
            <RevealItem
              as="li"
              key={head.division}
              className="group relative overflow-hidden rounded-2xl border border-graphite-900/10 bg-white shadow-card transition-shadow hover:shadow-lift"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1"
                style={{ backgroundColor: meta.color }}
              />
              <div className="p-6">
                {head.photoUrl && head.name ? (
                  <Image
                    src={head.photoUrl}
                    alt={`${head.name}, ${head.role}`}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                ) : (
                  <span
                    role="img"
                    aria-label={`Photo slot: ${head.role}`}
                    className="grid h-16 w-16 place-items-center rounded-2xl"
                    style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
                  >
                    <User className="h-7 w-7" strokeWidth={1.4} />
                  </span>
                )}
                <p
                  className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: meta.color }}
                >
                  {head.division}
                </p>
                <h3 className="mt-1 font-heading text-base font-semibold text-graphite-900">
                  {head.name ?? "Appointment to be announced"}
                </h3>
                <p className="mt-0.5 text-sm text-graphite-600">{head.role}</p>
                <div className="mt-4 flex items-center gap-2">
                  {head.email && (
                    <a
                      href={`mailto:${head.email}?subject=${encodeURIComponent(`Attn: ${head.role}`)}`}
                      aria-label={`Email the ${head.role}`}
                      className="grid h-8 w-8 place-items-center rounded-full border border-graphite-200 text-graphite-500 transition-colors hover:text-graphite-900"
                      style={{ borderColor: `${meta.color}55` }}
                    >
                      <Mail className="h-3.5 w-3.5" strokeWidth={1.7} />
                    </a>
                  )}
                  {head.linkedin && (
                    <a
                      href={head.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${head.role} on LinkedIn`}
                      className="grid h-8 w-8 place-items-center rounded-full border border-graphite-200 text-graphite-500 transition-colors hover:text-graphite-900"
                      style={{ borderColor: `${meta.color}55` }}
                    >
                      <Linkedin className="h-3.5 w-3.5" strokeWidth={1.7} />
                    </a>
                  )}
                  <span className="ml-auto grid h-8 w-8 place-items-center rounded-full" style={{ color: meta.color }}>
                    <Icon name={meta.icon} className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </div>
  );
}
