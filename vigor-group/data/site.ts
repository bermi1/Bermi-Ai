import { companies, activeSectors, type Sector } from "./companies";

/**
 * Group-level facts, compiled from the group's own public sources
 * (turkysgroup.co.tz, The Citizen, ZIBI magazine, LinkedIn). Mission and
 * vision are quoted from the group's published statements.
 */
export const group = {
  brand: "VIGOR",
  tradingName: "Vigor Group of Companies",
  legalName: "Turky's Group of Companies Limited",
  descriptor: "A Turky's Group of Companies",
  tagline: "Trusted Solutions for Life and Business",
  positioningShort: "Serving people, serving nations.",
  founded: "1980",
  positioning:
    "From a small family tailoring mart in 1980s Zanzibar to a diversified group across three countries — one family of companies serving life and business through healthcare, hospitality, real estate, manufacturing, trade, logistics, energy and more.",
  mission:
    "To invest in supplies, services, and local talent in ways that create value, generate employment, and improve quality of life for the communities we serve.",
  vision:
    "To set new benchmarks in quality, accessibility, and sustainable development — bringing world-class opportunities to local and global markets, and fostering progress through investment in services, infrastructure, and local talent.",
  hq: {
    street: "Migombani Street",
    city: "Zanzibar",
    poBox: "P.O. Box 271",
    country: "Tanzania",
  },
  email: "info@turkysgroup.co.tz",
  phone: "+255 671 700 800",
  phoneAlt: "+255 651 700 800",
  countries: ["Zanzibar", "Mainland Tanzania", "Union of Comoros"],
  stats: {
    companies: companies.length,
    employees: 4000,
    countries: 3,
    sectors: activeSectors.length,
  },
  url: "https://turkysgroup.co.tz",
};

export const leadership = [
  {
    name: "Taufiq Salim Turky",
    title: "Chairman",
    bio: "Former Chairman of the East African Chamber of Commerce, Industry & Agriculture (EACCIA) and former President of the Zanzibar National Chamber of Commerce, Industry & Agriculture (ZNCCIA).",
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

/**
 * Heads of divisions — one leader card per business division, each carrying
 * the division's accent colour, a photo slot, the role, and contact links.
 *
 * ⚠️ Only the three group executives above are verified public names.
 * Division-head `name` values are left as null until the group supplies
 * them — set `name`, `photoUrl` and `linkedin` here and the cards update
 * everywhere automatically. Do NOT invent names.
 */
export interface DivisionHead {
  division: string;
  sector: Sector;
  role: string;
  name: string | null; // null → renders as "Appointment to be announced"
  photoUrl?: string;
  linkedin?: string;
  email?: string;
}

export const divisionHeads: DivisionHead[] = [
  {
    division: "Healthcare",
    sector: "Healthcare",
    role: "Head of Healthcare Division",
    name: null,
    email: "info@turkysgroup.co.tz",
  },
  {
    division: "Hospitality",
    sector: "Hospitality",
    role: "Head of Hospitality Division",
    name: null,
    email: "info@turkysgroup.co.tz",
  },
  {
    division: "Real Estate",
    sector: "Real Estate",
    role: "Head of Real Estate Division",
    name: null,
    email: "info@turkysgroup.co.tz",
  },
  {
    division: "Manufacturing",
    sector: "Manufacturing",
    role: "Head of Manufacturing Division",
    name: null,
    email: "info@turkysgroup.co.tz",
  },
  {
    division: "Trade & Merchandise",
    sector: "Trade",
    role: "Head of Trade Division",
    name: null,
    email: "info@turkysgroup.co.tz",
  },
  {
    division: "Energy",
    sector: "Energy",
    role: "Head of Energy Division",
    name: null,
    email: "info@turkysgroup.co.tz",
  },
  {
    division: "Logistics & Transport",
    sector: "Maritime",
    role: "Head of Logistics & Transport",
    name: null,
    email: "info@turkysgroup.co.tz",
  },
  {
    division: "Communications",
    sector: "Communications",
    role: "Head of Communications Division",
    name: null,
    email: "info@turkysgroup.co.tz",
  },
];

export const founders = {
  intro:
    "The group traces its roots to the early 1980s, when the Turky family opened a small tailoring mart in Zanzibar — founded on craftsmanship, dedication and family values, and incorporated in 1980 as Turky's Group of Companies Limited.",
  people: [
    { name: "Salim Turky", note: "Founder" },
    { name: "Murtadha Turky", note: "Founder" },
    { name: "Yunus Turky", note: "Founder (late) — remembered with respect" },
    { name: "Hassan Turky", note: "Father of the founders (late) — the family patriarch" },
  ],
};

export const values = [
  {
    title: "Quality",
    body: "Delivering exceptional quality in every product and service — the standard the family has held since 1980.",
    icon: "shield",
  },
  {
    title: "Trust",
    body: "Maintaining trust and building long-lasting relationships with every client and community.",
    icon: "heart-handshake",
  },
  {
    title: "Community",
    body: "Empowering people in Zanzibar to achieve their dreams while building stronger communities.",
    icon: "landmark",
  },
  {
    title: "Sustainability",
    body: "Nurturing the planet and investing in sustainable development across every industry we serve.",
    icon: "trending-up",
  },
  {
    title: "Ethical governance",
    body: "Upholding ethical governance as the group grows across borders and sectors.",
    icon: "layers",
  },
];

/**
 * Per-sector presentation metadata. Each sector carries its own accent COLOUR,
 * giving every business unit a distinct identity while VIGOR red remains the
 * unifying group colour.
 */
export interface SectorMeta {
  sector: Sector;
  label: string;
  blurb: string;
  icon: string;
  color: string; // hex accent for this unit
  cta: { label: string };
}

export const sectorMeta: Record<Sector, SectorMeta> = {
  Healthcare: {
    sector: "Healthcare",
    label: "Healthcare",
    blurb: "Multi-specialty hospitals bringing modern care to Zanzibar.",
    icon: "stethoscope",
    color: "#0f9d8f",
    cta: { label: "Request an appointment" },
  },
  Hospitality: {
    sector: "Hospitality",
    label: "Hospitality",
    blurb: "International Golden Tulip hotels and boutique coastal stays.",
    icon: "bed-double",
    color: "#c98a1a",
    cta: { label: "Book now" },
  },
  "Real Estate": {
    sector: "Real Estate",
    label: "Real Estate",
    blurb: "Waterfront development and furnished homes for residents and investors.",
    icon: "building-2",
    color: "#2f6f9f",
    cta: { label: "Enquire" },
  },
  Manufacturing: {
    sector: "Manufacturing",
    label: "Manufacturing",
    blurb: "Bottling, packaging and cement — production that supplies the region.",
    icon: "factory",
    color: "#d97706",
    cta: { label: "Enquire" },
  },
  Trade: {
    sector: "Trade",
    label: "Trade & Merchandise",
    blurb: "Food and construction-materials importation and distribution at scale.",
    icon: "package",
    color: "#3f8f3f",
    cta: { label: "Enquire" },
  },
  Energy: {
    sector: "Energy",
    label: "Energy",
    blurb: "LPG distribution and grid-scale renewable energy across the region.",
    icon: "zap",
    color: "#eab308",
    cta: { label: "Enquire" },
  },
  Communications: {
    sector: "Communications",
    label: "Communications",
    blurb: "Connecting the group's markets across East Africa.",
    icon: "radio-tower",
    color: "#7c4dff",
    cta: { label: "Enquire" },
  },
  Automotive: {
    sector: "Automotive",
    label: "Automotive",
    blurb: "Diesel systems engineering and automotive solutions.",
    icon: "wrench",
    color: "#55606b",
    cta: { label: "Enquire" },
  },
  Logistics: {
    sector: "Logistics",
    label: "Logistics",
    blurb: "Moving people and goods across the group's territories.",
    icon: "truck",
    color: "#4f46e5",
    cta: { label: "Enquire" },
  },
  Maritime: {
    sector: "Maritime",
    label: "Maritime",
    blurb: "High-speed ferries linking Zanzibar and Dar es Salaam.",
    icon: "ship",
    color: "#0e7fb8",
    cta: { label: "Book a crossing" },
  },
  Aviation: {
    sector: "Aviation",
    label: "Aviation",
    blurb: "Air services connecting the islands and beyond.",
    icon: "plane",
    color: "#2596d1",
    cta: { label: "Enquire" },
  },
  Financial: {
    sector: "Financial",
    label: "Financial Services",
    blurb: "Financial services extending the group's reach in the Comoros.",
    icon: "wallet",
    color: "#0f8a5f",
    cta: { label: "Enquire" },
  },
  Services: {
    sector: "Services",
    label: "Services",
    blurb: "Cleaning and facilities services that keep the group running.",
    icon: "sparkles",
    color: "#6b7280",
    cta: { label: "Enquire" },
  },
};

/** Sectors spotlighted on the home carousel. */
export const spotlightSectors: Sector[] = [
  "Healthcare",
  "Hospitality",
  "Real Estate",
  "Manufacturing",
  "Energy",
  "Maritime",
];

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
      "golden-tulip-stone-town",
      "golden-tulip-dar-es-salaam-city-center",
      "golden-tulip-grande-comore",
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
    companySlugs: ["turkys-lpg", "green-energy"],
  },
  {
    title: "Logistics & Transport",
    description: "Aviation, high-speed ferries and diesel/automotive services.",
    icon: "truck",
    companySlugs: ["vigor-aviation", "zan-fast-ferries", "habib-euro-diesel"],
  },
  {
    title: "Communications",
    description: "Communications infrastructure and services.",
    icon: "radio-tower",
    companySlugs: ["nitak-communications"],
  },
  {
    title: "Financial Services",
    description: "Financial services in the Union of Comoros.",
    icon: "wallet",
    companySlugs: ["vigo-financial-services"],
  },
];

/** Partners & affiliations — only verified relationships. */
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
    companySlug: "golden-tulip-stone-town",
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
    companySlug: "green-energy",
  },
];

export interface Milestone {
  period: string;
  title: string;
  body: string;
}

export const timeline: Milestone[] = [
  {
    period: "1980",
    title: "A family tailoring mart",
    body: "The Turky family opens a small tailoring mart in Zanzibar, incorporated as Turky's Group of Companies Limited — founded on craftsmanship, dedication and family values.",
  },
  {
    period: "2004",
    title: "Into manufacturing",
    body: "Zainab Bottlers is established to produce affordable, quality beverages for the regional market — a flagship of the group's manufacturing arm.",
  },
  {
    period: "2015",
    title: "Into healthcare",
    body: "Ampola Tasakhtaa Hospital opens in Stone Town — a 130-bed multi-specialty hospital, in association with Global Hospitals (India).",
  },
  {
    period: "Today",
    title: "A three-country group",
    body: "A diversified group of companies and a workforce reported above 4,000, operating across Zanzibar, mainland Tanzania and the Union of Comoros — from ferries and hotels to a grid-scale solar plant supplying SONELEC.",
  },
];

export const presence = [
  {
    country: "Zanzibar",
    note: "Headquarters and heartland — healthcare, hospitality, real estate, trade, manufacturing, energy and maritime.",
    isHq: true,
  },
  {
    country: "Mainland Tanzania",
    note: "Hospitality and manufacturing, including Golden Tulip Dar es Salaam, Kisarawe Cement and Zan Fast Ferries routes.",
    isHq: false,
  },
  {
    country: "Union of Comoros",
    note: "Hospitality, financial services and grid-scale renewable energy — a solar plant in Anjouan supplying SONELEC.",
    isHq: false,
  },
];

export const faqs = [
  {
    q: "What is Vigor Group of Companies?",
    a: "VIGOR (legally Turky's Group of Companies Limited) is a Zanzibar-headquartered family group incorporated in 1980, operating across healthcare, hospitality, real estate, manufacturing, trade, logistics, maritime, energy, communications and financial services.",
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
