import type { Sector } from "./companies";

/**
 * Centralised careers listings across all subsidiaries.
 * PLACEHOLDER sample roles — replace with real openings (or wire to an ATS).
 */
export interface Job {
  id: string;
  title: string;
  sector: Sector;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  summary: string;
}

export const jobs: Job[] = [
  {
    id: "hc-nurse",
    title: "Registered Nurse",
    sector: "Healthcare",
    location: "Stone Town, Zanzibar",
    type: "Full-time",
    summary: "Deliver patient care across wards at a 130-bed multi-specialty hospital.",
  },
  {
    id: "hc-lab",
    title: "Laboratory Technician",
    sector: "Healthcare",
    location: "Zanzibar",
    type: "Full-time",
    summary: "Run diagnostics and support the clinical teams.",
  },
  {
    id: "hosp-fo",
    title: "Front Office Associate",
    sector: "Hospitality",
    location: "Zanzibar",
    type: "Full-time",
    summary: "Welcome guests and manage reservations at a boutique hotel.",
  },
  {
    id: "hosp-chef",
    title: "Sous Chef",
    sector: "Hospitality",
    location: "Dar es Salaam",
    type: "Full-time",
    summary: "Support kitchen operations at a city-centre hotel.",
  },
  {
    id: "re-sales",
    title: "Property Sales Consultant",
    sector: "Real Estate",
    location: "Zanzibar",
    type: "Full-time",
    summary: "Advise investors and residents on furnished apartments and villas.",
  },
  {
    id: "mfg-line",
    title: "Production Line Supervisor",
    sector: "Manufacturing",
    location: "Zanzibar",
    type: "Full-time",
    summary: "Oversee bottling and packaging production lines.",
  },
  {
    id: "trade-logistics",
    title: "Logistics Coordinator",
    sector: "Trade",
    location: "Zanzibar",
    type: "Full-time",
    summary: "Coordinate importation and distribution of goods.",
  },
  {
    id: "energy-tech",
    title: "Solar Field Technician",
    sector: "Energy",
    location: "Anjouan, Comoros",
    type: "Contract",
    summary: "Maintain PV and battery storage assets at a grid-scale plant.",
  },
];
