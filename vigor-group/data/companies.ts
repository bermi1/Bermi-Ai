/**
 * SINGLE SOURCE OF TRUTH for every subsidiary.
 *
 * Every company card, sector filter, dynamic route (/companies/[slug]),
 * footer quick-link and sitemap entry is generated from this array.
 * Adding company #17 is a one-line change here — never a new page build.
 */

export type Sector =
  | "Healthcare"
  | "Hospitality"
  | "Real Estate"
  | "Manufacturing"
  | "Trade"
  | "Energy"
  | "Communications"
  | "Automotive"
  | "Services";

export interface Company {
  slug: string;
  name: string;
  sector: Sector;
  description: string;
  notes: string;
  /** Optional short list of services/products shown on the company sub-page. */
  offerings?: string[];
  /** Optional external site the subsidiary currently runs. */
  externalUrl?: string;
}

export const companies: Company[] = [
  {
    slug: "ampola-tasakhtaa-hospital",
    name: "Ampola Tasakhtaa Hospital",
    sector: "Healthcare",
    description: "130-bed multi-specialty hospital in Stone Town (Vuga), Zanzibar.",
    notes: "Established 2015 in association with Global Hospitals (India).",
    offerings: [
      "Inpatient & emergency care",
      "Surgery & specialist clinics",
      "Diagnostics & laboratory",
      "Maternity & paediatrics",
    ],
  },
  {
    slug: "ampola-regency-hospital",
    name: "Ampola Regency Hospital",
    sector: "Healthcare",
    description: "Second hospital brand under the group's healthcare division.",
    notes: "",
    offerings: ["Outpatient services", "Specialist consultations", "Diagnostic services"],
  },
  {
    slug: "golden-tulip-zanzibar-boutique",
    name: "Golden Tulip Zanzibar Boutique",
    sector: "Hospitality",
    description: "Boutique hotel operated under franchise with Louvre Hotels Group.",
    notes: "International Golden Tulip brand franchise.",
    offerings: ["Boutique rooms & suites", "Restaurant & bar", "Events & conferencing"],
  },
  {
    slug: "golden-tulip-dar-es-salaam-city-center",
    name: "Golden Tulip Dar es Salaam City Center",
    sector: "Hospitality",
    description: "Hotel franchise property on mainland Tanzania.",
    notes: "",
    offerings: ["City-centre accommodation", "Business facilities", "Dining"],
  },
  {
    slug: "zanzibar-grand-beach-villa",
    name: "Zanzibar Grand Beach Villa & Boutique",
    sector: "Hospitality",
    description: "Boutique villa property in Zanzibar.",
    notes: "",
    offerings: ["Beachfront villas", "Private hospitality", "Leisure stays"],
  },
  {
    slug: "zanzibar-waterfront",
    name: "Zanzibar Waterfront",
    sector: "Real Estate",
    description: "Active waterfront development project.",
    notes: "Has its own dedicated site today (zanzibarwaterfront.co.tz).",
    externalUrl: "https://zanzibarwaterfront.co.tz",
    offerings: ["Waterfront development", "Mixed-use property", "Investment opportunities"],
  },
  {
    slug: "turkys-real-estate",
    name: "Turky's Real Estate",
    sector: "Real Estate",
    description: "Fully-furnished luxury apartments and villas for guests and investors.",
    notes: "",
    offerings: ["Furnished apartments", "Luxury villas", "Rentals & sales", "Property investment"],
  },
  {
    slug: "zainab-bottlers",
    name: "Zainab Bottlers",
    sector: "Manufacturing",
    description: "Beverage bottling and manufacturing.",
    notes: "",
    offerings: ["Beverage bottling", "Manufacturing & packaging", "Distribution"],
  },
  {
    slug: "turkys-mifuko",
    name: "Turky's Mifuko Company Limited",
    sector: "Manufacturing",
    description: "Bags and packaging production.",
    notes: '"Mifuko" is Swahili for bags/packaging.',
    offerings: ["Bag manufacturing", "Industrial packaging", "Custom production"],
  },
  {
    slug: "zenj-general-merchandise",
    name: "Zenj General Merchandise",
    sector: "Trade",
    description:
      "One of the largest importers/stockists of food and construction materials in Zanzibar.",
    notes: "",
    offerings: ["Food importation", "Construction materials", "Wholesale supply"],
  },
  {
    slug: "kisarawe-cement",
    name: "Kisarawe Cement Company Limited",
    sector: "Manufacturing",
    description: "Cement trading and manufacturing, mainland Tanzania.",
    notes: "",
    offerings: ["Cement manufacturing", "Cement trading", "Construction supply"],
  },
  {
    slug: "nitak-limited",
    name: "Nitak Limited",
    sector: "Communications",
    description: "Communications sector company.",
    notes: "",
    offerings: ["Communications services"],
  },
  {
    slug: "turkys-lpg",
    name: "Turky's LPG Co Limited",
    sector: "Energy",
    description: "LPG (cooking gas) distribution.",
    notes: "",
    offerings: ["LPG cylinder supply", "Cooking gas distribution", "Bulk & retail"],
  },
  {
    slug: "habib-euro-diesel",
    name: "Habib Euro Diesel",
    sector: "Automotive",
    description: "Diesel system engineering and solutions.",
    notes: "Affiliate of Al Shahid Diesel System, Dubai.",
    offerings: ["Diesel system engineering", "Injection & pump services", "Automotive solutions"],
  },
  {
    slug: "renewable-energy-division",
    name: "Renewable Energy Division (PV-BESS)",
    sector: "Energy",
    description: "Hybrid solar PV-battery energy storage plant in Anjouan, Comoros.",
    notes: "Supplies Comoros' national electricity company (SONELEC).",
    offerings: ["Solar PV generation", "Battery energy storage", "Grid-scale supply"],
  },
  {
    slug: "v-clean",
    name: "V-Clean",
    sector: "Services",
    description: "Group services company.",
    notes: "Limited public detail available; verify scope directly with the group.",
    offerings: ["Group services"],
  },
];

/** Ordered list of sectors that actually have companies (for filters/tabs). */
export const activeSectors: Sector[] = Array.from(
  new Set(companies.map((c) => c.sector)),
);

export function getCompany(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}

export function companiesBySector(sector: Sector): Company[] {
  return companies.filter((c) => c.sector === sector);
}

export function allSlugs(): string[] {
  return companies.map((c) => c.slug);
}
