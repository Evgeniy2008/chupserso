# chupserso — portfolio

A cinematic, near-black, bilingual (EN / RU) portfolio of Evgeny Chupakhin, full-stack developer (Next.js, React, TypeScript, Node.js, SaaS & AI).

**Stack:** Next.js 16 (App Router, Cache Components, Partial Prefetching) · React 19 · TypeScript (strict) · Tailwind CSS v4 · GSAP + ScrollTrigger · Motion · Lenis · next-intl · lucide-react · next/font (Geist).

```bash
npm install
npm run dev          # http://localhost:3000 → redirects to /en
npm run check        # typecheck + lint + production build
```

---

## Make it yours

Everything personal lives in data files — no component needs editing.

| What | Where |
| --- | --- |
| Name, portrait, availability badge, contact links | `src/config/site.ts` |
| All interface copy (hero, sections, buttons, SEO, a11y labels) | `src/messages/en.json`, `src/messages/ru.json` |
| Projects and case studies (both languages) | `src/features/projects/data.ts` |
| Project images & portrait | originals in `media/originals/` → `npm run media` → `public/` |
| Public URL (canonical, hreflang, sitemap, OG) | `NEXT_PUBLIC_SITE_URL` env var |

### 1. `src/config/site.ts`

- `name` (Latin, for SEO), `displayName` per language (shown on the page), `wordmark` (`chupserso`, header + giant footer type).
- `contacts` — email, Telegram, phone, Upwork, Freelancehunt, LinkedIn, GitHub, Instagram. Set any of them to `null` to hide it everywhere (contact rows, menu, footer, structured data).
- `portrait` / `avatar` — paths of the processed photos (see Images).
- `availableForWork` — toggles the "Available for new projects" badge.

### 2. Copy

`src/messages/*.json` — both files must have the same keys (TypeScript types are generated from `en.json`). Arrays (headline lines, list items) are read with `t.raw()`. The hero headline is split into lines **per language** (`hero.lines`) so line breaks stay deliberate; type size is calculated from the longest line on the server, so changing the copy never breaks the layout. Use a non-breaking space (` `) to keep short words together, e.g. Russian prepositions.

### 3. Projects

`src/features/projects/data.ts` — order in the file is the order on the site. `featured: true` projects (PBC Game, PRO Casino, ContentBuilder AI, WorldDrop) get the large sticky cards; the rest are listed in the compact "More projects" index with a hover preview. The last five entries were drafted from workspace notes — review them and delete anything you don't want public. A commented template for a new project is at the bottom of the file.

Each project has `status` (`live` · `commercial` · `client` · `mvp` · `in-development` · `placeholder`), optional `year`, `stack` (may be empty — PRO Casino's is, fill it in), optional `links.live` / `links.repo`, and full copy for each locale. Case-study pages at `/[locale]/work/[slug]` are generated automatically.

### 4. Images

- **Originals** live in `media/originals/` (portrait, PBC Game, PRO Casino, ContentBuilder screenshots). `npm run media` (sharp) turns them into web images: the portrait crop and avatar, browser-window covers for desktop screenshots, a phone mock-up for the mobile one, and detail crops for case-study galleries. Crops and compositions are defined in `scripts/prepare-media.mjs`.
- **Placeholders** for projects without screenshots are monochrome SVGs (`npm run covers`), flagged `placeholder: true` (dashed badge in development).
- `cover.position` sets the focal point when a frame crops the image (e.g. the phone mock-up on narrow screens).
- On desktop, screenshots and the portrait are shown near-monochrome and turn to full colour on hover; case-study pages show them in colour.

Raster images go through `next/image` (AVIF/WebP, responsive sizes).

### 5. Site URL

Set `NEXT_PUBLIC_SITE_URL=https://your-domain.com` **at build time** (it's inlined). Without it, canonical/hreflang/sitemap URLs point to `http://localhost:3000`.

---

## Project structure

```
src/
  app/
    [locale]/            root layout (html/body), home, case studies, 404, OG images
    sitemap.ts robots.ts manifest.ts icon.svg apple-icon.tsx
  components/
    layout/              Header, MobileMenu, LanguageSwitcher, Footer, Intro, Guides
    sections/            Hero (+ WebGL canvas), Marquee, SelectedWork, Expertise, About, Process, Contact
    motion/              SmoothScroll, MotionDirector, Parallax, Magnetic, Cursor, Providers
    ui/                  Button, SmartLink, Roll, SectionLabel, SplitLines
  features/
    projects/            types, data, queries
    contact/             contact rows, copy-email button
  config/site.ts         personal configuration
  i18n/                  routing, navigation, request config (next/root-params)
  messages/              en.json, ru.json
  lib/                   seo, fit (server-side text fitting), gsap, smooth scroll, og
  hooks/                 useMediaQuery
  styles/globals.css     design tokens, utilities, motion CSS
  proxy.ts               locale routing + real 404s for unknown case studies
scripts/generate-covers.mjs
```

Server Components by default; client boundaries are small and named for what they do.

## Motion system

One language, four tools, no overlap:

- **CSS** — the opening curtain and the hero entrance. They run before hydration, so the first screen is choreographed even on slow devices and the LCP isn't held back.
- **GSAP + ScrollTrigger** — everything scroll-linked: hero parallax layers, the sticky project stack, cover parallax, the self-reading About statement, the pinned horizontal Process track (desktop) and the timeline fill (mobile). All created via `useGSAP` + `gsap.matchMedia`, so they're reverted on unmount and on breakpoint changes.
- **Motion** — component state only: mobile menu, magnetic buttons, the contextual "View" cursor. Loaded through `LazyMotion` (`domAnimation`, strict).
- **Lenis** — wheel/trackpad smoothing only. Touch devices keep native momentum; it drives the real window scroll, so anchors, find-in-page and the scrollbar keep working. No scroll hijacking.

Scroll reveals use a single `MotionDirector` (IntersectionObserver + `data-reveal` attributes). Content is fully visible in the server HTML; only after hydration — and only if motion is allowed — are below-the-fold elements hidden and revealed.

`prefers-reduced-motion: reduce` → no intro, no Lenis, no reveals, no parallax, a still frame for the hero shader, and the Process section uses the vertical layout.

The hero light field is a single raw-WebGL fragment shader (no three.js): rendered at ~0.5× resolution, paused off-screen and in background tabs, 30 fps on touch devices, a still frame on low-power hardware, CSS gradient fallback without WebGL.

## Internationalisation

- Routes: `/en` (default) and `/ru`; `/` redirects to `/en`. Locale detection is off on purpose — English for everyone, the visitor switches explicitly.
- The switcher keeps the current page and scroll position; the page softly dims while the other language loads.
- Localised metadata, `hreflang` (+ `x-default`), canonical URLs, `og:locale`, per-locale OG images, `<html lang>`.
- Adding a language: add it to `locales` in `src/i18n/routing.ts`, create `src/messages/<code>.json`, add copy for every project in `data.ts` (TypeScript will tell you what's missing), add its name to `localeNames`.

## SEO & accessibility

- Unique titles/descriptions per page, Open Graph + Twitter cards, generated OG images (Geist with Cyrillic, from `src/assets/fonts`), sitemap with alternates, robots, web manifest.
- JSON-LD: `Person` + `WebSite` on every page, `CreativeWork` on case studies — only configured, real data.
- Semantic landmarks, one `h1` per page, skip link, visible focus rings, the mobile menu behaves as a modal dialog (inert background, Escape, focus return), accessible language links (`hreflang`, `lang`, `aria-current`), text contrast ≥ 4.5:1 including "dimmed" states.

## Measured results

Lighthouse 12.8 against the local production build (`next build && next start`, Chrome headless, MacBook M2), home page `/en`:

| Page / profile | Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| `/en` desktop (simulated) | 99 | 100 | 100 | 92* | 0.7 s | 0 |
| `/en` mobile, simulated slow 4G | 90 | 100 | 100 | 92* | 3.5 s | 0 |
| `/en` mobile, applied slow 4G (`--throttling-method=devtools`) | 93 | 100 | 100 | 92* | 1.6 s | 0 |

\* the only failing SEO audit is `canonical`: the server ran on port 3301 while canonical URLs pointed at the default `http://localhost:3000`. With `NEXT_PUBLIC_SITE_URL` matching the real domain it passes.

With applied throttling the mobile LCP equals the first contentful paint: the hero copy is visible from the first frame (the intro curtain covers its starting state). The simulated figure is Lighthouse's model estimate.

These are local lab numbers, not field data — re-measure on your production domain.

## Deploy

**Vercel (recommended):** import the repo, set `NEXT_PUBLIC_SITE_URL` in Project → Settings → Environment Variables, deploy. Nothing else to configure.

**Any Node host:** `npm ci && NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build && npm run start` (Node 20+; behind nginx/Caddy for TLS). The site needs a Node server (locale proxy, OG images), so `output: 'export'` isn't used.

## Scripts


| Script | |
| --- | --- |
| `npm run dev` | dev server |
| `npm run build` / `npm start` | production build / server |
| `npm run typecheck` | route types + `tsc --noEmit` |
| `npm run lint` | ESLint (next/core-web-vitals + TypeScript) |
| `npm run check` | all of the above + build |
| `npm run media` | rebuild portrait, avatar and project images from `media/originals/` |
| `npm run covers` | regenerate placeholder project visuals |

## Known limitations

- WorldDrop, ClickShield, Krevoo, ViraText, CatalogFlow and HalfKnives still use placeholder visuals.
- PRO Casino has no technology list yet (`stack: []`).
- 404 responses carry a real 404 status, but their markup is resumed on the client (a Cache Components behaviour), so the 404 page needs JavaScript to render its content.
