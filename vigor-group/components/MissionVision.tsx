import { Target, Eye } from "lucide-react";
import { group } from "@/data/site";
import { Reveal } from "@/components/motion/Reveal";

/** The group's published mission and vision statements. */
export function MissionVision() {
  const items = [
    { icon: Target, label: "Our mission", body: group.mission },
    { icon: Eye, label: "Our vision", body: group.vision },
  ];
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((item, i) => (
        <Reveal
          key={item.label}
          delay={i * 0.06}
          className="relative overflow-hidden rounded-2xl border border-graphite-900/10 bg-white p-8 shadow-card"
        >
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-brand-600" />
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <item.icon className="h-6 w-6" strokeWidth={1.7} />
          </span>
          <h3 className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
            {item.label}
          </h3>
          <p className="mt-2 font-heading text-lg leading-relaxed text-graphite-800">
            {item.body}
          </p>
        </Reveal>
      ))}
    </div>
  );
}
