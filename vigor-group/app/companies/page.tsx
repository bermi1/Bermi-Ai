import { companies } from "@/data/companies";
import { pageMeta } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { CompanyGrid } from "@/components/CompanyGrid";
import { CTABand } from "@/components/CTABand";

export const metadata = pageMeta({
  title: "Our companies",
  description: `Browse all ${companies.length} companies in the Vigor Group, filterable by sector — healthcare, hospitality, real estate, manufacturing, trade, energy, communications and more.`,
  path: "/companies",
});

export default function CompaniesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our companies"
        title="One group, many companies"
        intro="Every subsidiary lives inside the same unified system — filter by sector to find the company you need."
      />
      <section className="container py-16">
        <CompanyGrid />
      </section>
      <CTABand
        title="Don't see what you're looking for?"
        body="Tell us what you need and we'll point you to the right company in the group."
        primary={{ href: "/contact", label: "Contact the group" }}
        secondary={{ href: "/services", label: "Browse by service" }}
      />
    </>
  );
}
