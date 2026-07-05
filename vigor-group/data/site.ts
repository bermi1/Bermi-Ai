import type { Sector } from "./companies";

/** Group-level facts. All values sourced from the brief — do not invent figures. */
export const group = {
  tradingName: "Vigor Group of Companies",
  legalName: "Turky's Group of Companies",
  tagline: "Trusted Solutions for Life and Business",
  founded: "Early 1980s",
  positioning:
    "From a family tailoring mart in Zanzibar to a diversified East African group — one family of companies serving life and business across healthcare, hospitality, real estate, manufacturing, trade, energy and communications.",
  hq: {
    street: "Migombani Street",
    city: "Zanzibar",
    poBox: "P.O. Box 271",
    country: "Tanzania",
  },
  email: "info@vigorgroup.co.tz",
  phone: "+255 24 000 0000",
  countries: ["Zanzibar", "Mainland Tanzania", "Union of Comoros"],
  stats: {
    companies: 16,
    employees: 4000,
    countries: 3,
  },
  url: "https://www.vigorgroup.co.tz",
};

export const leadership = [
  {
    name: "Taufiq Salim Turky",
    title: "Chairman",
    bio: "Former Chairman of the East African Chamber of Commerce, Industry & Agriculture; former President of the Zanzibar National Chamber of Commerce, Industry & Agriculture.",
  },
  {
    name: "Abdallah Salim Turky",
    title: "Chief Executive Officer",
    bio: "Leads the group's day-to-day operations across all sectors and territories.",
  },
  {
    name: "Khaytham Salim Turky",
    title: "Group Ambassador",
    bio: "Represents Vigor Group across partnerships, institutions and international relationships.",
  },
];

/** Founding narrative anchors — used on About. */
export const founders = {
  intro:
    "The group traces its roots to the early 1980s, when the Turky family opened a tailoring mart in Zanzibar.",
  people: [
    { name: "Salim Turky", note: "Founder" },
    { name: "Murtadha Turky", note: "Founder" },
    { name: "Yunus Turky", note: "Founder (late) — remembered with respect" },
    { name: "Hassan Turky", note: "Father of the founders (late) — the family patriarch" },
  ],
};

export const values = [
  {
    title: "Integrity",
    body: "Trusted solutions, delivered honestly — the reputation the family has built since the 1980s.",
    icon: "shield",
  },
  {
    title: "Heritage",
    body: "A Zanzibari family enterprise, grounded in the community it grew from.",
    icon: "landmark",
  },
  {
    title: "Diversification",
    body: "Sixteen companies across seven sectors, resilient by design.",
    icon: "layers",
  },
  {
    title: "Service",
    body: "Solutions for both life and business — from hospitals and hotels to fuel and housing.",
    icon: "heart-handshake",
  },
  {
    title: "Growth",
    body: "Operations spanning Zanzibar, mainland Tanzania and the Union of Comoros.",
    icon: "trending-up",
  },
];

/**
 * Per-sector presentation metadata: the spotlight carousel, chip filters,
 * card tags and per-sector contextual CTAs all read from here.
 */
export interface SectorMeta {
  sector: Sector;
  label: string;
  blurb: string;
  icon: string;
  cta: { label: string; kind: "email" | "link" };
}

export const sectorMeta: Record<Sector, SectorMeta> = {
  Healthcare: {
    sector: "Healthcare",
    label: "Healthcare",
    blurb: "Multi-specialty hospitals bringing modern care to Zanzibar and beyond.",
    icon: "stethoscope",
    cta: { label: "Request an appointment", kind: "email" },
  },
  Hospitality: {
    sector: "Hospitality",
    label: "Hospitality",
    blurb: "International hotel brands and boutique stays across the coast.",
    icon: "bed-double",
    cta: { label: "Book now", kind: "email" },
  },
  "Real Estate": {
    sector: "Real Estate",
    label: "Real Estate",
    blurb: "Waterfront developments and furnished homes for residents and investors.",
    icon: "building-2",
    cta: { label: "Enquire", kind: "email" },
  },
  Manufacturing: {
    sector: "Manufacturing",
    label: "Manufacturing & Trade",
    blurb: "Bottling, packaging and cement — production that supplies the region.",
    icon: "factory",
    cta: { label: "Enquire", kind: "email" },
  },
  Trade: {
    sector: "Trade",
    label: "Trade",
    blurb: "Food and construction-materials importation and distribution at scale.",
    icon: "package",
    cta: { label: "Enquire", kind: "email" },
  },
  Energy: {
    sector: "Energy",
    label: "Energy",
    blurb: "LPG distribution and grid-scale renewable energy across the Union of Comoros.",
    icon: "zap",
    cta: { label: "Enquire", kind: "email" },
  },
  Communications: {
    sector: "Communications",
    label: "Communications",
    blurb: "Connecting the group's markets across East Africa.",
    icon: "radio-tower",
    cta: { label: "Enquire", kind: "email" },
  },
  Automotive: {
    sector: "Automotive",
    label: "Automotive",
    blurb: "Diesel systems engineering and automotive solutions.",
    icon: "wrench",
    cta: { label: "Enquire", kind: "email" },
  },
  Services: {
    sector: "Services",
    label: "Services",
    blurb: "Supporting services that keep the group running.",
    icon: "sparkles",
    cta: { label: "Enquire", kind: "email" },
  },
};

/** The six sectors spotlighted on the home carousel (per the brief). */
export const spotlightSectors: Sector[] = [
  "Healthcare",
  "Hospitality",
  "Real Estate",
  "Manufacturing",
  "Energy",
  "Communications",
];

/**
 * Cross-cutting service index for /services — organised by NEED, not by which
 * subsidiary owns it. Each category maps to the company slugs that serve it.
 */
export interface ServiceCategory {
  title: string;
  description: string;
  icon: string;
  companySlugs: string[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    title: "Healthcare Services",
    description: "Hospital care, specialist clinics and diagnostics.",
    icon: "stethoscope",
    companySlugs: ["ampola-tasakhtaa-hospital", "ampola-regency-hospital"],
  },
  {
    title: "Hospitality & Accommodation",
    description: "International-brand hotels and boutique coastal stays.",
    icon: "bed-double",
    companySlugs: [
      "golden-tulip-zanzibar-boutique",
      "golden-tulip-dar-es-salaam-city-center",
      "zanzibar-grand-beach-villa",
    ],
  },
  {
    title: "Real Estate & Property",
    description: "Waterfront development, furnished homes and investment.",
    icon: "building-2",
    companySlugs: ["zanzibar-waterfront", "turkys-real-estate"],
  },
  {
    title: "Manufacturing & Packaging",
    description: "Beverage bottling, bags, packaging and cement.",
    icon: "factory",
    companySlugs: ["zainab-bottlers", "turkys-mifuko", "kisarawe-cement"],
  },
  {
    title: "Trade & FMCG Distribution",
    description: "Food and construction-materials importation and wholesale.",
    icon: "package",
    companySlugs: ["zenj-general-merchandise"],
  },
  {
    title: "Energy & Fuel",
    description: "LPG distribution and grid-scale renewable energy.",
    icon: "zap",
    companySlugs: ["turkys-lpg", "renewable-energy-division"],
  },
  {
    title: "Communications",
    description: "Communications infrastructure and services.",
    icon: "radio-tower",
    companySlugs: ["nitak-limited"],
  },
  {
    title: "Automotive",
    description: "Diesel systems engineering and automotive solutions.",
    icon: "wrench",
    companySlugs: ["habib-euro-diesel"],
  },
];

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/companies", label: "Companies" },
  { href: "/services", label: "Services" },
  { href: "/news", label: "News" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];
