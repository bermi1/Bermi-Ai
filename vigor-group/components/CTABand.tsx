import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/Reveal";

export function CTABand({
  title = "Partner with Vigor Group",
  body = "Whether you're a customer, supplier, investor or future colleague — there's a door into the group for you.",
  primary = { href: "/contact", label: "Get in touch" },
  secondary = { href: "/companies", label: "Explore companies" },
}: {
  title?: string;
  body?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="container py-20">
      <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-graphite-800 to-graphite-950 px-8 py-14 text-center sm:px-12">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-heading text-3xl font-semibold text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg text-graphite-100/80">{body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={primary.href} variant="gold" size="lg">
              {primary.label}
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </ButtonLink>
            <ButtonLink href={secondary.href} variant="onDark" size="lg">
              {secondary.label}
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
