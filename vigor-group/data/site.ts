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

/**
 * Partners & affiliations — sourced only from the verified company notes in
 * data/companies.ts (no fabricated relationships).
 */
export interface Partner {
  name: string;
  relation: string;
  sector: Sector;
  companySlug: string;
}

export const partners: Partner[] = [
  {
    name: "Global Hospitals (India)",
    relation: "Healthcare partner — Ampola Tasakhtaa Hospital",
    sector: "Healthcare",
    companySlug: "ampola-tasakhtaa-hospital",
  },
  {
    name: "Louvre Hotels Group",
    relation: "Golden Tulip franchise — hospitality",
    sector: "Hospitality",
    companySlug: "golden-tulip-zanzibar-boutique",
  },
  {
    name: "Al Shahid Diesel System (Dubai)",
    relation: "Affiliate — Habib Euro Diesel",
    sector: "Automotive",
    companySlug: "habib-euro-diesel",
  },
  {
    name: "SONELEC (Comoros)",
    relation: "National electricity company — renewable energy offtaker",
    sector: "Energy",
    companySlug: "renewable-energy-division",
  },
];

/**
 * Group journey — eras and dated milestones. Only facts from the brief are
 * used; undated growth is expressed as an era, not an invented year.
 */
export interface Milestone {
  period: string;
  title: string;
  body: string;
}

export const timeline: Milestone[] = [
  {
    period: "Early 1980s",
    title: "A family tailoring mart",
    body: "The Turky family opens a tailoring mart in Zanzibar — the foundation of everything that follows.",
  },
  {
    period: "Following decades",
    title: "Diversification",
    body: "The business expands beyond tailoring into trade, manufacturing, hospitality and real estate across Zanzibar and mainland Tanzania.",
  },
  {
    period: "2015",
    title: "Into healthcare",
    body: "Ampola Tasakhtaa Hospital opens in Stone Town — a 130-bed multi-specialty hospital, in association with Global Hospitals (India).",
  },
  {
    period: "Today",
    title: "A regional group",
    body: "Sixteen companies and a workforce historically reported above 4,000, operating across Zanzibar, mainland Tanzania and the Union of Comoros — including a grid-scale solar plant supplying SONELEC.",
  },
];

/** Country presence for the global-presence section. */
export const presence = [
  {
    country: "Zanzibar",
    note: "Headquarters and heartland — healthcare, hospitality, real estate, trade and manufacturing.",
    isHq: true,
  },
  {
    country: "Mainland Tanzania",
    note: "Hospitality and manufacturing, including Golden Tulip Dar es Salaam and Kisarawe Cement.",
    isHq: false,
  },
  {
    country: "Union of Comoros",
    note: "Grid-scale renewable energy — a hybrid solar PV-battery plant in Anjouan supplying SONELEC.",
    isHq: false,
  },
];

/** Frequently asked questions — factual, drawn from the brief. */
export const faqs = [
  {
    q: "What is Vigor Group of Companies?",
    a: "Vigor Group (legally Turky's Group of Companies) is a Zanzibar-headquartered family conglomerate of 16 companies spanning healthcare, hospitality, real estate, manufacturing, trade, energy and communications.",
  },
  {
    q: "Is the group connected to the country of Turkey?",
    a: "No. Despite the founding family's surname (Turky), the group has no connection to the country of Turkey. It is a Zanzibari family enterprise.",
  },
  {
    q: "Where does the group operate?",
    a: "Across three territories: Zanzibar (headquarters), mainland Tanzania, and the Union of Comoros.",
  },
  {
    q: "How do I partner with or supply to the group?",
    a: "Use the contact form and we'll route your enquiry to the right company. One message reaches the whole group.",
  },
  {
    q: "How can I apply for a job?",
    a: "Visit the Careers page for openings across all subsidiaries, or send an open application — we keep applications on file across every company.",
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
