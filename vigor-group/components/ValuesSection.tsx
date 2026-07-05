import { values } from "@/data/site";
import { Icon } from "@/components/Icon";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

/** Reusable across Home and About. */
export function ValuesSection() {
  return (
    <section className="container py-20 sm:py-24">
      <Reveal>
        <SectionHeading
          eyebrow="What we stand for"
          title="Values built over four decades"
          intro="From a single tailoring mart to sixteen companies, the same principles have carried the family forward."
        />
      </Reveal>

      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" as="ul">
        {values.map((v) => (
          <RevealItem
            as="li"
            key={v.title}
            className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-100 text-gold-700">
              <Icon name={v.icon} className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-heading text-lg font-semibold text-ink-900">
              {v.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{v.body}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
