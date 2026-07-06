import { MapPin } from "lucide-react";
import { presence } from "@/data/site";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

/** Three-country presence, dark band with a stylized coastline motif. */
export function GlobalPresence() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 py-20 text-white sm:py-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -left-24 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-ink-500/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:52px_52px]" />
      </div>
      <div className="container">
        <Reveal>
          <SectionHeading
            dark
            eyebrow="Global presence"
            title="Across three territories"
            intro="From a Zanzibar headquarters to mainland Tanzania and the Union of Comoros — one group, operating across borders."
          />
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3" as="ul">
          {presence.map((p) => (
            <RevealItem
              as="li"
              key={p.country}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-gold-200">
                  <MapPin className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-lg font-semibold">{p.country}</h3>
                  {p.isHq && (
                    <span className="rounded-full bg-gold-400 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-900">
                      HQ
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-sand-100/75">{p.note}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
