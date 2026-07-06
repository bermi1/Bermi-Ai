# Vigor Group of Companies — Unified Platform

A modern, server-rendered marketing website for **Vigor Group of Companies** (legal name:
_Turky's Group of Companies_), a Zanzibar-headquartered conglomerate spanning healthcare,
hospitality, real estate, manufacturing, trade, energy, communications and more.

This single platform replaces a fragmented set of independent subsidiary sites: **one design
system, one codebase, one data source** — with each of the 16 companies getting its own branded
sub-page _inside_ the same system, never a separate site.

---

## Tech stack

| Concern     | Choice                                        |
| ----------- | --------------------------------------------- |
| Framework   | Next.js 14 (App Router) + TypeScript (strict) |
| Styling     | Tailwind CSS                                  |
| Animation   | Framer Motion                                 |
| UI          | shadcn-style primitives (CVA) + lucide icons  |
| Data        | A single typed file, `data/companies.ts`      |

No WordPress, no PHP, no CMS plugins anywhere.

---

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build (also runs lint + type-check)
npm run start    # serve the production build
npm run lint     # ESLint
npm run format   # Prettier (+ Tailwind class sorting)
```

Requires Node 18.18+ (Node 20+ recommended).

---

## Project structure

```
app/                 App Router routes (each page exports real metadata)
  page.tsx           Home
  about/             About the group
  companies/         Company grid + dynamic /companies/[slug] template
  services/          Cross-cutting service index (search by need)
  news/              News & press (list + /news/[slug])
  careers/           Centralised careers across all subsidiaries
  contact/           Group-level contact + map placeholder
  sitemap.ts         sitemap.xml generated from data + static routes
  robots.ts          robots.txt
  layout.tsx         Root shell (nav, footer, fonts, global metadata)
  template.tsx       Framer Motion route-transition wrapper
components/          Reusable UI + motion + section components
  ui/                Button, Card, Badge (shadcn-style, CVA)
  motion/            Reveal, RevealGroup, CountUp
data/                SINGLE SOURCE OF TRUTH
  companies.ts       All 16 subsidiaries (drives cards, filters, routes, sitemap)
  site.ts            Brand facts, leadership, values, sectors, service categories
  news.ts            News/press entries
  careers.ts         Job listings
lib/                 utils (cn, dates) + seo (per-page metadata helper)
public/              og-default.svg and static assets
```

---

## Where to change things

### Company data (add company #17 in one line)

Everything — the company grid, sector filters, footer quick-links, the dynamic
`/companies/[slug]` pages and `sitemap.xml` — is generated from the array in
**`data/companies.ts`**. Append one object to that array and a fully-formed company page,
card and sitemap entry appear automatically. No new page files, no component edits.

### Brand palette

Edit the `colors` block in **`tailwind.config.ts`**:

- `ink` — deep indigo/teal primary (coastal Zanzibar + institutional trust)
- `gold` — warm gold/sand accent (heritage, hospitality, founding-family legacy)
- `sand` — off-white background

### Fonts

Edit the `next/font/google` imports in **`app/layout.tsx`**:

- `Fraunces` — heritage serif for headings & wordmark
- `Inter` — geometric sans for body

### Group facts, leadership, values, sectors, service categories

All in **`data/site.ts`**.

### News & careers content

**`data/news.ts`** and **`data/careers.ts`** — plain typed arrays. A non-developer can add a
post or role by appending one object; no design change or component redeploy required. Swap
either for a CMS/markdown/ATS loader later while keeping the same exported shape.

---

## ⚠️ Placeholder content — pending real assets from the client

The following are **deliberate placeholders** until Vigor Group supplies real brand assets and
content. They are safe to replace without touching layout code:

- **Brand palette & fonts** — chosen to read Zanzibari and heritage-led, _not_ the group's
  official brand guidelines. See `tailwind.config.ts` and `app/layout.tsx`.
- **Logo / wordmark** — a typographic "V" lockup in `components/Wordmark.tsx`.
- **All photography** — rendered as branded gradient panels via
  `components/PlaceholderImage.tsx` (with descriptive `alt`/`aria-label` text). No stock or
  fabricated photography is used, per the brief. Swap for `next/image` when real photos exist.
- **Leadership photos** — placeholder panels; names and titles are the real ones from the brief.
- **News & press** — three sample entries in `data/news.ts`.
- **Careers** — sample roles in `data/careers.ts`.
- **Contact phone & email, map embed** — placeholder values in `data/site.ts`; the map is a
  styled placeholder, not a live embed.
- **`group.url`** in `data/site.ts` — set this to the real production domain so canonical URLs,
  OpenGraph tags and the sitemap point to the correct host.

Only facts supplied in the brief (leadership names/titles, the 16 companies, HQ address, scale
figures) are used as real content. No financial figures, staff names or photography have been
fabricated.

> Note on the name: despite the surname's resemblance, the group has **no** connection to the
> country of Turkey. Copy throughout avoids any such implication.

---

## Beyond the brief

Extra depth layered on top of the required pages:

- **Company search** — the `/companies` grid has a live text search alongside the sector
  filter, with an empty state and reset.
- **Group journey timeline** — an animated 1980s→today milestone timeline on About
  (`components/Timeline.tsx`), built only from facts in the brief.
- **Global presence** — a three-territory section (Zanzibar / mainland Tanzania / Comoros).
- **Partners & affiliations** — surfaced on Home and About from the verified company notes
  (Global Hospitals, Louvre Hotels/Golden Tulip, Al Shahid Diesel, SONELEC) — no invented ties.
- **FAQ accordion** — accessible, animated, single-open (`components/ui/accordion.tsx`) on Contact.
- **Breadcrumbs** on company sub-pages.
- **Organization JSON-LD** structured data (`components/JsonLd.tsx`) for richer search results.
- **`loading` / `error` states** and a **web app manifest** (`app/manifest.ts`) for mobile install.

Content for all of the above lives in `data/site.ts` (partners, timeline, presence, faqs).

## What this build fixes (vs. the incumbent sites)

- **Real SEO** — every page is server-rendered and exports real `title`, `description` and
  OpenGraph metadata (`lib/seo.ts`), fixing the noindex/SPA-invisibility problem of the old
  JS-only subsidiary sites.
- **`sitemap.xml` + `robots.txt`** — generated dynamically from the data file plus static
  routes (`app/sitemap.ts`, `app/robots.ts`).
- **One unified system** — shared nav, footer and "Part of Vigor Group" shell across every
  company, so no subsidiary reads as an orphaned site.
- **Careers & news layers** — a centralised careers page and a news/press section the closest
  regional benchmark lacks.
- **Accessible & mobile-first** — semantic headings, keyboard-navigable nav/filters, skip link,
  reduced-motion support, and a responsive layout tuned for a mobile-heavy audience.

---

## Animation

- **Route transitions** via `app/template.tsx` (cross-fade + lift on every navigation).
- **Scroll reveals** (`components/motion/Reveal.tsx`) — staggered fade + upward translate.
- **Company grid filtering** — Framer Motion `layout` animations reflow cards smoothly.
- **Count-up stats** (`components/motion/CountUp.tsx`) — animate when scrolled into view.
- **Navbar** — transparent over the home hero, solidifies on scroll.
- All transitions ≤ ~400ms on an ease-out curve, with `prefers-reduced-motion` respected.
