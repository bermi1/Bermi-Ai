import { leadership } from "@/data/site";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function LeadershipStrip({ withBio = false }: { withBio?: boolean }) {
  return (
    <RevealGroup className="grid gap-6 sm:grid-cols-3" as="ul">
      {leadership.map((person) => (
        <RevealItem as="li" key={person.name}>
          <PlaceholderImage
            label={`${person.name} — ${person.title}`}
            icon="landmark"
            aspect="aspect-[4/5]"
          />
          <h3 className="mt-4 font-heading text-lg font-semibold text-graphite-900">
            {person.name}
          </h3>
          <p className="text-sm font-medium text-brand-700">{person.title}</p>
          {withBio && (
            <p className="mt-2 text-sm leading-relaxed text-graphite-600">{person.bio}</p>
          )}
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
