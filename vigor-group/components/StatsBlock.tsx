import { group } from "@/data/site";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Scroll-triggered count-up stats — minimal, Apple-style: huge near-black
 * numerals on white, one red keyline, quiet labels.
 */
export function StatsBlock() {
  const stats = [
    { value: group.stats.companies, suffix: "", label: "Companies" },
    { value: group.stats.sectors, suffix: "", label: "Sectors" },
    { value: group.stats.employees, suffix: "+", label: "Employees" },
    { value: group.stats.countries, suffix: "", label: "Countries" },
  ];
  return (
    <Reveal>
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
        Since {group.founded}
      </p>
      <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <dt className="font-heading text-6xl font-bold tracking-tight text-graphite-950 sm:text-7xl">
              <CountUp value={s.value} suffix={s.suffix} />
            </dt>
            <dd className="mt-3 text-sm text-graphite-500">{s.label}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
