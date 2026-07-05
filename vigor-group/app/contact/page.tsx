import { Mail, MapPin, Phone } from "lucide-react";
import { group } from "@/data/site";
import { pageMeta } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Reveal } from "@/components/motion/Reveal";

export const metadata = pageMeta({
  title: "Contact us",
  description: `Get in touch with ${group.tradingName} — one group-level contact for all ${group.stats.companies} companies. Headquartered on ${group.hq.street}, ${group.hq.city}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact us"
        title="Talk to the group"
        intro="One message reaches the whole group. Tell us what you need and we'll connect you with the right company."
      />

      <section className="container grid gap-12 py-16 lg:grid-cols-[1fr_1.1fr]">
        {/* Details */}
        <Reveal>
          <h2 className="font-heading text-2xl font-semibold text-ink-900">Head office</h2>
          <ul className="mt-6 space-y-5">
            <li className="flex items-start gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-100 text-gold-700">
                <MapPin className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <div>
                <p className="font-medium text-ink-900">Address</p>
                <p className="mt-0.5 text-sm text-ink-600">
                  {group.hq.street}, {group.hq.city}
                  <br />
                  {group.hq.poBox}, {group.hq.country}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-100 text-gold-700">
                <Mail className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <div>
                <p className="font-medium text-ink-900">Email</p>
                <a
                  href={`mailto:${group.email}`}
                  className="mt-0.5 block text-sm text-ink-600 hover:text-gold-700"
                >
                  {group.email}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3.5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-100 text-gold-700">
                <Phone className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <div>
                <p className="font-medium text-ink-900">Phone</p>
                <a
                  href={`tel:${group.phone.replace(/\s/g, "")}`}
                  className="mt-0.5 block text-sm text-ink-600 hover:text-gold-700"
                >
                  {group.phone}
                </a>
                <p className="mt-0.5 text-xs text-ink-400">Placeholder — confirm with the group.</p>
              </div>
            </li>
          </ul>

          {/* Map embed placeholder */}
          <div
            role="img"
            aria-label={`Map placeholder showing ${group.hq.street}, ${group.hq.city}`}
            className="relative mt-8 flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl border border-ink-900/10 bg-gradient-to-br from-ink-100 to-sand-200"
          >
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,#0c2329_1px,transparent_1px),linear-gradient(to_bottom,#0c2329_1px,transparent_1px)] [background-size:32px_32px]" />
            <div className="relative flex flex-col items-center gap-2 text-ink-600">
              <MapPin className="h-7 w-7 text-gold-600" strokeWidth={1.7} />
              <span className="text-sm font-medium">
                {group.hq.street}, {group.hq.city}
              </span>
              <span className="text-xs text-ink-400">Map embed placeholder</span>
            </div>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal delay={0.05} className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card sm:p-8">
          <h2 className="font-heading text-2xl font-semibold text-ink-900">Send a message</h2>
          <p className="mt-2 text-sm text-ink-600">
            We&apos;ll route your enquiry to the right company in the group.
          </p>
          <div className="mt-6">
            <EnquiryForm subjectPrefix="Contact enquiry" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
