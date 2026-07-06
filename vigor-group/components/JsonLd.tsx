import { group, presence } from "@/data/site";
import { companies } from "@/data/companies";

/**
 * Organization structured data (schema.org) for richer search results.
 * Rendered once in the root layout.
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: group.tradingName,
    legalName: group.legalName,
    slogan: group.tagline,
    url: group.url,
    email: group.email,
    foundingDate: "1980",
    address: {
      "@type": "PostalAddress",
      streetAddress: group.hq.street,
      addressLocality: group.hq.city,
      postOfficeBoxNumber: group.hq.poBox,
      addressCountry: group.hq.country,
    },
    areaServed: presence.map((p) => p.country),
    numberOfEmployees: { "@type": "QuantitativeValue", value: group.stats.employees },
    subOrganization: companies.map((c) => ({ "@type": "Organization", name: c.name })),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
