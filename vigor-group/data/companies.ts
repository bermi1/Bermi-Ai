/**
 * SINGLE SOURCE OF TRUTH for every subsidiary.
 *
 * Content compiled from the group's own public sources (turkysgroup.co.tz,
 * The Citizen, ZIBI magazine, LinkedIn). Every card, filter, dynamic route,
 * footer link and sitemap entry is generated from this array — adding a new
 * company is a one-line change.
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
  | "Logistics"
  | "Maritime"
  | "Aviation"
  | "Financial"
  | "Services";

export interface Company {
  slug: string;
  name: string;
  sector: Sector;
  description: string;
  notes: string;
  country?: string;
  offerings?: string[];
  externalUrl?: string;
}

export const companies: Company[] = [
  // ── Healthcare ──────────────────────────────────────────────
  {
    slug: "ampola-tasakhtaa-hospital",
    name: "Ampola Tasakhtaa Hospital",
    sector: "Healthcare",
    description: "130-bed multi-specialty hospital in Stone Town (Vuga), Zanzibar.",
    notes: "Established 2015 in association with Global Hospitals (India).",
    country: "Zanzibar",
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
    description: "The group's second hospital brand under its healthcare division.",
    notes: "",
    country: "Zanzibar",
    offerings: ["Outpatient services", "Specialist consultations", "Diagnostics"],
  },
  // ── Hospitality ─────────────────────────────────────────────
  {
    slug: "golden-tulip-stone-town",
    name: "Golden Tulip Stone Town",
    sector: "Hospitality",
    description: "Boutique hotel in historic Stone Town, Zanzibar, under franchise with Louvre Hotels Group.",
    notes: "International Golden Tulip brand franchise.",
    country: "Zanzibar",
    offerings: ["Boutique rooms & suites", "Restaurant & bar", "Events & conferencing"],
  },
  {
    slug: "golden-tulip-dar-es-salaam-city-center",
    name: "Golden Tulip Dar es Salaam City Center",
    sector: "Hospitality",
    description: "City-centre hotel franchise property on mainland Tanzania.",
    notes: "",
    country: "Mainland Tanzania",
    offerings: ["City-centre accommodation", "Business facilities", "Dining"],
  },
  {
    slug: "golden-tulip-grande-comore",
    name: "Golden Tulip Grande Comore",
    sector: "Hospitality",
    description: "Golden Tulip hotel property in the Union of Comoros.",
    notes: "",
    country: "Union of Comoros",
    offerings: ["Hotel accommodation", "Dining", "Events"],
  },
  {
    slug: "zanzibar-grand-beach-villa",
    name: "Zanzibar Grand Beach Villa & Boutique",
    sector: "Hospitality",
    description: "Boutique beachfront villa property in Zanzibar.",
    notes: "",
    country: "Zanzibar",
    offerings: ["Beachfront villas", "Private hospitality", "Leisure stays"],
  },
  // ── Real Estate ─────────────────────────────────────────────
  {
    slug: "zanzibar-waterfront",
    name: "Zanzibar Waterfront",
    sector: "Real Estate",
    description: "Flagship waterfront real-estate development in Zanzibar.",
    notes: "Runs its own dedicated site (zanzibarwaterfront.com).",
    country: "Zanzibar",
    externalUrl: "https://www.zanzibarwaterfront.com",
    offerings: ["Waterfront development", "Mixed-use property", "Investment opportunities"],
  },
  {
    slug: "turkys-real-estate",
    name: "Turky's Real Estate",
    sector: "Real Estate",
    description: "Fully-furnished luxury apartments and villas for guests and investors.",
    notes: "",
    country: "Zanzibar",
    offerings: ["Furnished apartments", "Luxury villas", "Rentals & sales", "Property investment"],
  },
  // ── Manufacturing ───────────────────────────────────────────
  {
    slug: "zainab-bottlers",
    name: "Zainab Bottlers",
    sector: "Manufacturing",
    description: "Beverage bottling and manufacturing — one of the group's flagship investments.",
    notes: "Established 2004, producing affordable, quality products for the regional market.",
    country: "Zanzibar",
    externalUrl: "https://zainabbottlers.co.tz",
    offerings: ["Beverage bottling", "Manufacturing & packaging", "Distribution"],
  },
  {
    slug: "turkys-mifuko",
    name: "Turky's Mifuko Company Limited",
    sector: "Manufacturing",
    description: "Bags and packaging production.",
    notes: '"Mifuko" is Swahili for bags/packaging.',
    country: "Zanzibar",
    offerings: ["Bag manufacturing", "Industrial packaging", "Custom production"],
  },
  {
    slug: "kisarawe-cement",
    name: "Kisarawe Cement Company Limited",
    sector: "Manufacturing",
    description: "Cement manufacturing and trading on mainland Tanzania.",
    notes: "",
    country: "Mainland Tanzania",
    offerings: ["Cement manufacturing", "Cement trading", "Construction supply"],
  },
  // ── Trade / Merchandise ─────────────────────────────────────
  {
    slug: "zenj-general-merchandise",
    name: "Zenj General Merchandise",
    sector: "Trade",
    description:
      "One of the largest importers and stockists of food products and construction materials in Zanzibar.",
    notes: "Distributes across Zanzibar through Vigor outlets.",
    country: "Zanzibar",
    offerings: ["FMCG importation", "Construction materials", "Wholesale & retail supply"],
  },
  // ── Energy ──────────────────────────────────────────────────
  {
    slug: "turkys-lpg",
    name: "Turky's LPG Gas",
    sector: "Energy",
    description: "LPG (cooking gas) supply and distribution.",
    notes: "",
    country: "Zanzibar",
    offerings: ["LPG cylinder supply", "Cooking gas distribution", "Bulk & retail"],
  },
  {
    slug: "green-energy",
    name: "Green Energy (PV-BESS)",
    sector: "Energy",
    description: "Hybrid solar PV-battery energy storage plant in Anjouan, Union of Comoros.",
    notes: "Supplies Comoros' national electricity company, SONELEC.",
    country: "Union of Comoros",
    offerings: ["Solar PV generation", "Battery energy storage", "Grid-scale supply"],
  },
  // ── Communications ──────────────────────────────────────────
  {
    slug: "nitak-communications",
    name: "Nitak Communications",
    sector: "Communications",
    description: "Communications infrastructure and services.",
    notes: "",
    country: "Zanzibar",
    offerings: ["Communications services", "Connectivity"],
  },
  // ── Logistics / Aviation / Maritime / Automotive ────────────
  {
    slug: "vigor-aviation",
    name: "Vigor Aviation",
    sector: "Aviation",
    description: "The group's aviation and air-services operation.",
    notes: "",
    country: "Zanzibar",
    offerings: ["Air services", "Aviation operations"],
  },
  {
    slug: "zan-fast-ferries",
    name: "Zan Fast Ferries",
    sector: "Maritime",
    description:
      "High-speed passenger ferries linking Zanzibar and Dar es Salaam aboard MV Zanzibar 1 and MV Zanzibar 2.",
    notes: "Crossing time approximately 1 hour 20 minutes.",
    country: "Zanzibar & Mainland",
    offerings: ["Passenger ferry service", "Zanzibar ↔ Dar es Salaam routes", "Online booking"],
  },
  {
    slug: "habib-euro-diesel",
    name: "Habib Euro Diesel (V-Diesel)",
    sector: "Automotive",
    description: "Diesel systems engineering, injection services and automotive solutions.",
    notes: "Affiliate of Al Shahid Diesel System, Dubai.",
    country: "Zanzibar",
    offerings: ["Diesel system engineering", "Injection & pump services", "Automotive solutions"],
  },
  // ── Financial ───────────────────────────────────────────────
  {
    slug: "vigo-financial-services",
    name: "Vigo Financial Services",
    sector: "Financial",
    description: "Financial services operation based in the Union of Comoros.",
    notes: "",
    country: "Union of Comoros",
    offerings: ["Financial services"],
  },
  // ── Services ────────────────────────────────────────────────
  {
    slug: "v-clean",
    name: "V-Clean",
    sector: "Services",
    description: "Group cleaning and facilities services company.",
    notes: "",
    country: "Zanzibar",
    offerings: ["Cleaning services", "Facilities support"],
  },
];

/** Ordered list of sectors that actually have companies (for filters/tabs). */
export const activeSectors: Sector[] = Array.from(new Set(companies.map((c) => c.sector)));

export function getCompany(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug);
}

export function companiesBySector(sector: Sector): Company[] {
  return companies.filter((c) => c.sector === sector);
}

export function allSlugs(): string[] {
  return companies.map((c) => c.slug);
}
