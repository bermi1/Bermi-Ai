import { group } from "@/data/site";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";

/** Scroll-triggered count-up stats. */
export function StatsBlock() {
  const stats = [
    { value: group.stats.companies, suffix: "", label: "Operating companies" },
    { value: group.stats.employees, suffix: "+", label: "Employees historically" },
    { value: group.stats.countries, suffix: "", label: "Countries of operation" },
  ];
  return (
    <Reveal className="rounded-3xl bg-graphite-900 px-8 py-12 text-white sm:px-12">
      <dl className="grid gap-8 text-center sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="font-heading text-5xl font-semibold text-brand-200">
              <CountUp value={s.value} suffix={s.suffix} />
            </dt>
            <dd className="mt-2 text-sm text-graphite-100/75">{s.label}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
