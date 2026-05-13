# Geordin Zolliecoffer — Portfolio Handoff

**Last updated:** 2026-05-13 (v2 — mobile redesign shipped)

Comprehensive handoff for the Geordin Zolliecoffer visual merchandising portfolio site. Hand this file to a fresh Claude session and they should be able to make changes, deploy, and explain the system without re-reading the build history.

---

## 1. What this is

A personal portfolio site for **Geordin Zolliecoffer**, a Lead Visual Merchandiser (Los Angeles). The site showcases three case studies:

| # | Project | Year | Role |
|---|---|---|---|
| 01 | **Kith West Hollywood** — new $20M flagship | 2024 | Lead Visual Merchandiser |
| 02 | **Kith Sunset** — original West Coast flagship | 2016 — Present | Lead Visual Merchandiser |
| 03 | **Nordstrom Thousand Oaks** — full-store remodel | 2022 — 2024 | Visual Merchandiser |

**54 stills total** across the three projects (25 + 9 + 20), all converted to webp with orientation baked into pixels (no EXIF rotation gotchas).

The site is **single-page-app + multi-route** (React Router): homepage flow + `/work`, `/about`, `/contact`, `/work/:slug` for individual case studies. Mobile-responsive. Built for editorial fashion-magazine feel — bold Inter Tight uppercase display, hard cream + black + signal-blue palette, generous whitespace, hairline rules.

This was forked from `createdbybc.com` (the `brendon-portfolio-v3` template) and then **completely visually redesigned** at the user's request — the only thing left from the template is the build tooling, routing scaffold, and a couple of motion components. All copy, design system, sections, components, layouts, fonts, palette, and content are original to Geordin.

---

## 2. Where everything lives

### Local machine (this Mac)
```
/Users/brendoncarbullido/Downloads/Geordin Zolliecoffer/
├── portfolio-template-playbook.md       # original brief from Brendon
├── GZPortfolio_24.pdf                   # Geordin's existing portfolio (reference)
├── kith/                                # 37 source images (HEIC, JPG, PNG)
├── nordstrom/                           # 20 source images (HEIC)
├── staged/work/                         # 54 webp outputs (ready for R2)
├── convert-media-v2.sh                  # HEIC/JPG/PNG → webp conversion script
└── geordin-portfolio/                   # the repo
    ├── HANDOFF.md                       # this file
    ├── README.md                        # quick-start (kept short)
    ├── Open Portfolio.command           # double-click to open in browser
    ├── Dockerfile                       # multi-stage node→nginx
    ├── docker-compose.yml               # restart: unless-stopped on port 8080
    ├── docker/nginx.conf                # SPA fallback + caching rules
    ├── index.html, package.json, vite.config.ts, tailwind.config.ts, tsconfig*.json
    ├── public/
    │   ├── favicon.svg
    │   └── images/work/                 # 54 webp files (mirror of ../staged/work/)
    └── src/                             # see Section 5 for full breakdown
```

### Homelab (deployment target)
- **SSH:** `ssh homelab` (alias for `bhomelab@homelab` via Tailscale, key already authorized)
- **Repo path:** `~/apps/geordin-portfolio/` (mirrors local repo via rsync)
- **Container name:** `geordin-portfolio` — built from the local Dockerfile
- **Port:** **8080** → mapped to nginx port 80 inside the container
- **Image:** `geordin-portfolio-portfolio:latest` (~117 MB)
- **Resource footprint:** ~5 MB RAM, 0 % CPU at idle

### Network endpoints (verified working)
| Network | URL |
|---|---|
| Tailscale (any tailnet device) | `http://homelab:8080` |
| Tailscale MagicDNS FQDN | `http://homelab.tail5a87f7.ts.net:8080` |
| LAN (ethernet) | `http://192.168.1.51:8080` |
| LAN (wifi) | `http://192.168.1.244:8080` |

The container auto-starts on homelab reboots (`restart: unless-stopped`).

---

## 3. Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite 5 + TypeScript 5 |
| Styling | Tailwind v3 (config in `tailwind.config.ts`) + a tiny `globals.css` for design tokens / Ken-Burns keyframes |
| Motion | Framer Motion 11 |
| Routing | React Router 6 |
| Image hosting | local `public/images/work/` (R2 staging available but not wired) |
| Production server | nginx 1.27 alpine inside Docker (multi-stage build from node:22-alpine) |
| Dev server | Vite (also containerizable via `npm run dev`) |

Node version installed on homelab: **v22.22.2**. npm v10.9.7.

---

## 4. Design system

All in `tailwind.config.ts` + CSS variables in `src/styles/globals.css`.

### Palette
| Token | Hex | Use |
|---|---|---|
| `paper` / `cream` | `#F6F4EF` | page background — warm off-white |
| `paper-2` / `cream-2` | `#EDEAE2` | secondary surfaces, image letterbox fill |
| `ink` | `#0E0E0E` | primary text, dark inverse backgrounds |
| `ink-2` | `#1A1A1A` | secondary dark |
| `ink-soft` | `#8A8780` | mono labels, meta text |
| `signal` | `#3D4F8A` | accent (used for "@" "." in email, Zolliecoffer second line, active scroll dot, signal-blue results, watercolor) — carried from Geordin's existing PDF brand |
| `signal-soft` | `#5C7FB8` | softer accent, watercolor highlight |
| `rule` | `rgba(14,14,14,0.14)` | hairline rules between sections |

### Typography (from Google Fonts via `index.html`)
- **Display + body:** `Inter Tight` (weights 400, 500, 600, 700, 800, 900) — bold geometric sans for everything
- **Mono labels:** `JetBrains Mono` (weights 300, 400, 500) — every eyebrow, index strip, meta label

No serif italic anywhere. No Cormorant Garamond (intentionally stripped from the template).

### Sizes
- `text-display-xl`: `clamp(3.5rem, 14vw, 16rem)` — masthead names + work index title
- `text-display-lg`: `clamp(2.75rem, 9vw, 10rem)` — section headlines
- `text-display-md`: `clamp(2rem, 5vw, 5rem)` — case study headlines
- `text-eyebrow` / `text-caption`: `0.6875rem` with `0.22em` letter-spacing — mono labels

### Motion
- Default ease: `cubic-bezier(0.16, 1, 0.3, 1)` (smooth out)
- Snap ease: `cubic-bezier(0.65, 0.01, 0.35, 1)` (intro loader, route curtain)
- Reduced-motion media query disables all animations + parallax

---

## 5. File structure (`src/`)

```
src/
├── App.tsx                                # router + LightboxProvider + chrome (Nav, SectionNav, ScrollFlow)
├── main.tsx                               # React mount
├── vite-env.d.ts
│
├── components/
│   ├── HeaderCarousel.tsx                 # auto-cycling thumb strip for page headers (dimmed, behind title)
│   ├── HeroSlideshow.tsx                  # masthead crossfade slideshow (6 images, 4.5s interval)
│   ├── Lightbox.tsx                       # global click-to-expand viewer + LightboxImage component
│   ├── MosaicCollage.tsx                  # 4-image asymmetric grid w/ 3D scroll motion (homepage chapters)
│   ├── Nav.tsx                            # fixed top nav strip (mix-blend-difference)
│   ├── ScrollFlow.tsx                     # decorative watercolor orb that drifts with page scroll
│   ├── ScrollToTop.tsx                    # scrolls to top on route change
│   ├── SectionNav.tsx                     # floating right-side section nav (glassmorphism card)
│   └── motion/
│       ├── Cursor.tsx                     # custom crosshair cursor (desktop only)
│       ├── IntroLoader.tsx                # first-visit black curtain (session-storage gated)
│       └── RouteCurtain.tsx               # ink panel wipe on route change
│
├── data/
│   ├── projects.ts                        # the 3 case studies + all metadata + image manifests
│   └── resume.ts                          # bio / experience / education / contact info
│
├── hooks/
│   ├── useFocusTrap.ts                    # used by Lightbox + mobile nav
│   ├── useMediaPreload.ts                 # used by IntroLoader for asset preload progress
│   └── useMediaQuery.ts                   # SSR-safe matchMedia subscription (mobile/desktop branching)
│
├── lib/
│   ├── media.ts                           # image() / video() / poster() helpers (R2 OR local)
│   ├── preloadAssets.ts                   # which assets preload on intro / route change
│   └── tint.ts                            # hex → rgba helpers (currently unused but kept)
│
├── pages/
│   ├── AboutPage.tsx                      # /about — bio + About + Expertise (no Experience timeline)
│   ├── CaseStudy.tsx                      # /work/:slug — single case study
│   ├── CaseStudyPage.tsx                  # re-exports CaseStudy (router uses this name)
│   ├── ContactPage.tsx                    # /contact
│   ├── HomePage.tsx                       # / — Masthead → WorkGrid → About → Expertise → Contact
│   ├── NotFoundPage.tsx
│   └── WorkPage.tsx                       # /work — full archive (all 54 images grouped by project)
│
├── sections/
│   ├── About.tsx                          # ink-inverse manifesto + 2-col bio + numeric strip
│   ├── Contact.tsx                        # one-line oversized email + 3-col metadata
│   ├── Expertise.tsx                      # tag-chip grid (12 disciplines, no accordion)
│   ├── Footer.tsx                         # mono strip — mark + index + © + email
│   ├── HeroMosaic.tsx                     # masthead — desktop only: name (focal) + slideshow (integrated upper-right)
│   ├── HeroMosaicMobile.tsx               # masthead — mobile only: full-bleed slideshow → stacked names → metadata → scroll cue. HomePage picks between the two via useMediaQuery.
│   ├── Process.tsx                        # ⚠️ no longer mounted anywhere (Method section removed by request)
│   └── WorkGrid.tsx                       # 3 chapter spreads with MosaicCollage each
│
└── styles/
    └── globals.css                        # tokens (CSS vars), Ken-Burns keyframes, base resets
```

### Files removed from the template (don't recreate)
- `src/three/*` (R3F hero, FaceTracker, HeroCamera, etc.) — site has no video hero, no R3F dependency
- `src/sections/ProjectsRail.tsx`, `Marquee.tsx`, `mobile/WorkDeck*.tsx` — removed
- `src/components/{WorkCard,WorkModal,HeroTextOverlay,GyroPermission,RecenterButton,ExperienceToggle,WatercolorAccent}.tsx` — replaced or removed
- `src/components/motion/{RoleRotator,Scramble,Magnetic,SectionReveal,SplitReveal}.tsx` — removed (some still referenced in `sections/Process.tsx` which is unmounted)
- `src/pages/ResumePage.tsx` — removed (route + nav links also gone)
- `api/contact.ts` — removed (site uses plain mailto)
- `scripts/`, `docker-compose.yml` (template's), `public/files/`, `public/fonts/`, `public/images/about/` — removed

---

## 6. Routes + page flow

| Route | Page file | What it renders |
|---|---|---|
| `/` | `pages/HomePage.tsx` | Masthead → WorkGrid (3 chapters, 4-image mosaic each) → About → Expertise → Contact |
| `/work` | `pages/WorkPage.tsx` | Hero strip → 3 project sections, each rendering ALL of that project's images in CSS-column masonry |
| `/work/:slug` | `pages/CaseStudy.tsx` | Single case study. Desktop: hero image at native ratio + separate caption/title strip → headline + 4-col metadata → overview + deliverables → column-masonry gallery → ink-inverse next-project section. Mobile (forked via `useMediaQuery`): hero `h-[70vh]` with title overlay (gradient + text-shadow for contrast) → 2-col metadata strip with hairline rules (Client / Role / Year / Category) → headline → overview → deliverables/results with leading mono numbers (`01`, `02`, …) → justified gallery → full-width hairline next-project tap target. |
| `/about` | `pages/AboutPage.tsx` | Name hero + HeaderCarousel → About inverse spread → Education → Expertise (no Experience timeline, no Method) |
| `/contact` | `pages/ContactPage.tsx` | Top strip + intro → Contact (oversized one-line email) |
| `/*` | `pages/NotFoundPage.tsx` | 404 |

### Chrome (always-mounted, layered z-indices)
- `Nav` (fixed top, `mix-blend-difference`, mobile menu drawer)
- `SectionNav` (fixed right, glassmorphism card with `backdrop-blur-xl + rounded-2xl + shadow`, vertical-center, hidden on mobile)
- `MobileProgress` (fixed top, thin scroll-progress bar with active-section label, `md:hidden` — mobile counterpart to SectionNav)
- `GalleryStripMobile` (in-flow, mobile-only) — justified-row gallery for `/work` and `/work/:slug`. Layout is computed at render time from build-time image dimensions baked into `src/data/projects.ts` by `scripts/measure-images.mjs`. No runtime `new Image()` probing.
- `ScrollFlow` (fixed left, decorative watercolor orb that drifts vertically and rotates with `useScroll` + `useSpring`)
- `Cursor` (custom crosshair, desktop only, mix-blend-difference)
- `IntroLoader` (first-visit only, session-storage key `gz-intro-seen`)
- `RouteCurtain` (panel wipe on route change)
- `LightboxProvider` wraps the whole app — every `<LightboxImage />` registers automatically; click opens fullscreen with `← →` keyboard nav, ESC to close, caption inside the image with gradient

---

## 7. Content / data

### `src/data/projects.ts`

Each project has this shape:
```ts
{
  id, slug, title, client, category, year,
  mediaType: 'image',                       // we don't have video for any project
  image: image('work/...-still-N.webp'),    // the lead/hero image
  featured: [4 image URLs],                 // shown on homepage WorkGrid mosaic
  tint: '#hex',
  caseStudy: {
    headline,
    overview,
    role,
    deliverables: string[],
    images: string[],                       // ALL images for this project (full archive)
    color: '#hex',
    results: string[],
  }
}
```

| Slug | Filename pattern | Count |
|---|---|---|
| `kith-west-hollywood` | `kith-west-hollywood-still-1.webp` … `-still-25.webp` | 25 |
| `kith-sunset` | `kith-sunset-still-1.webp` … `-still-9.webp` (incl. NBA All-Star = still-9) | 9 |
| `nordstrom-thousand-oaks` | `nordstrom-thousand-oaks-still-1.webp` … `-still-20.webp` | 20 |

### `src/data/resume.ts`

```
{
  identity { name, roles[], location, email, phone, portfolio, instagram, linkedin, resumePdf },
  summary, summaryShort,
  impact: [{value, label}],                # numeric strip on AboutPage
  experience: [{title, company, dateRange, bullets[]}],  # 3 entries — Kith WeHo, Kith Sunset, Nordstrom
  skills { direction[], production[], tools[] },
  industries: string[],
  education { school: FIDM, degree: Visual Communications, years: 2013–2015 }
  clients: ['Kith', 'Nordstrom']
}
```

**Note:** the Experience timeline section was removed from `AboutPage.tsx` by request, but the `experience[]` data still exists in the file in case it's wanted later. The `instagram` and `linkedin` fields are intentionally empty (her decision — no socials).

---

## 8. Key components — what each does

### `HeroMosaic.tsx` (the masthead)
The home page opener. **Name is the focal point** — `GEORDIN` and `ZOLLIECOFFER` in oversized uppercase Inter Tight 800 (`clamp(3.5rem, 14vw, 16rem)`). Image is integrated into the same composition: `HeroSlideshow` in the upper-right at 46% width. The name's second line uses `text-signal` (blue) + `mix-blend-multiply` so it visually integrates with the lower portion of the image. Below: 3-col metadata row (Currently · bio · status pill).

### `WorkGrid.tsx` + `MosaicCollage.tsx`
Three chapters, each a 4-image asymmetric mosaic:
```
┌──────────────┬──────────┐
│              │  side 1  │
│              ├──────────┤
│   LEAD       │  side 2  │
│              ├──────────┤
│              │  side 3  │
└──────────────┴──────────┘
```
- Layout uses `grid-rows-3` with lead spanning all 3 rows; side cells get `aspect-[4/3]` so heights are deterministic
- Lead image uses `object-cover` to fill its cell; can be slightly cropped — full image visible in the lightbox
- Each image rides its own scroll-tracked 3D track (`y`, `rotateY`, `translateZ`) driven by `useScroll` → `useTransform`
- `perspective: 1600px` on the container creates real depth
- Alternates `reverse` per chapter so images alternate sides

### `HeroSlideshow.tsx`
Crossfade slideshow used in the masthead. All images mounted simultaneously; only the active one has `opacity: 1`. Auto-advances every 4.5s; pauses on hover; click expands to lightbox. Uses CSS transition (not Framer's `AnimatePresence`) to avoid the ghost-frame bug we hit earlier.

**Mobile-aware props** (added for `HeroMosaicMobile` — do not delete as vestigial; desktop callers pass the defaults which preserve the original layout):
- `aspect` — empty string disables the inline `aspect-ratio` so the parent controls height (e.g. `h-[60vh]`). Default `4/3` for the desktop masthead.
- `dotsAtBottom` — `true` puts progress dots at the image's bottom edge AND hides the "Fig. NN / NN" caption strip (which would collide with the dots). Default `false` keeps the desktop layout.

### `HeaderCarousel.tsx`
Slim thumb strip used in page headers (Work, About, Contact). Layered BEHIND the title via absolute positioning + `z-0`, dimmed (opacity 0.5). Click any thumb to expand. The internal scroll uses `track.scrollTo({left})` calculated from `child.offsetLeft` — **never** uses `scrollIntoView`, because that would scroll the page.

### `SectionNav.tsx`
Floating right-side nav, **glassmorphism card** (`rounded-2xl border bg-gradient-to-br from-paper/85 backdrop-blur-xl shadow-[multi-layer]`). Tracks which section is in view via `IntersectionObserver` and scrolls smoothly when clicked.

Hardcoded section list (in this order, including per-project chapters from `projects.ts`):
```
hero, work-grid,
chapter-{slug} × 3 projects,
about, expertise, contact
```
Scans the DOM on every route change — only the IDs that actually exist on the current page get rendered. So homepage shows {Index, Work, About, Capabilities, Contact}; `/work` shows {Kith W.H., Kith Sunset, Nordstrom}.

Per-project labels live in the `PROJECT_LABELS` map at the top of the file — edit there if a label needs to change.

### `ScrollFlow.tsx`
Decorative watercolor orb (signal-blue radial gradient, 22 px Gaussian blur) fixed at left-edge. Drifts vertically `8vh → 70vh`, rotates `0 → 220°`, scales `1 → 1.18 → 0.95`, with subtle X-drift, all driven by `useSpring(scrollYProgress)`. Behind content (`z-0`, `pointer-events-none`). Hidden under `prefers-reduced-motion`. Echoes the watercolor motif from Geordin's PDF brand identity.

### `Lightbox.tsx` (provider + `<LightboxImage />`)
Wraps the entire app. Any `<LightboxImage src group />` self-registers with the provider.
- Click opens fullscreen frame (image at natural resolution, never upscaled — `max-width: min(100%, 1600px); max-height: min(78vh, 1200px)`)
- `← →` arrow keys walk through images sharing the same `group` (typically the project slug)
- ESC or backdrop click closes
- **Caption lives inside the image's wrapper** (not the dialog) so it stays at the bottom-right of the image itself, with `bg-gradient-to-t from-ink/85` for legibility
- Caption is auto-derived from filename via `metaFromSrc(src)` — parses `{slug}-still-{n}.webp` and looks up the project. Three lines: **client** / **title** / `Category · Year`. No more "Plate" prefix (user removed).
- **Mobile touch gestures** (`(max-width: 767px)` gated): swipe left/right → next/previous, swipe down ≥100px → close. Implemented on the modal `motion.div` via `onTouchStart` / `onTouchEnd` using a `useRef` for the origin; `touchStartRef` is unconditionally cleared at the top of `onTouchEnd` so no stale state can leak into the next gesture. Pinch-to-zoom is browser-native: `touch-action: pinch-zoom` on the `<img>`, `touch-action: pan-y` on the modal wrapper. When `visualViewport.scale > 1.05` (user already zoomed in) the gesture handlers bail out so single-finger pan of the zoomed image isn't read as a swipe.

### `Nav.tsx`
Fixed top nav strip. On desktop, uses `mix-blend-difference` so it reads on both cream and ink backgrounds without an explicit background of its own. On mobile, switches to a solid `bg-paper/95 backdrop-blur-sm` cream surface with ink text — mix-blend over photos is unreliable on mobile (per the redesign brief). Mobile also offsets down by `mt-9` to clear the `MobileProgress` bar. Hamburger → fullscreen ink-inverse drawer with stacked oversized links and mono section indices (`01 WORK`, `02 ABOUT`, `03 CONTACT`); drawer slides in from the top and out the same way.

### `About.tsx` (the section, mounted on home + about pages)
Ink-inverse spread (`bg-ink text-paper`). Manifesto headline condensed to two lines: *"I build the story a customer walks into / before they touch a single garment."* Image at left, 2-col body at right, numeric stat strip at bottom (`03 Flagships · $20M Flagship Redevelopment · 04 Assistants Trained · 12+ Departments Covered`). **Mobile-only watercolor accent**: a single soft signal-blue blur shape (`bg-signal/35 blur-3xl`) sits behind the manifesto headline. Static, decorative, `md:hidden` — desktop composition is unaffected. This carries the watercolor motif from `ScrollFlow` (desktop only) onto mobile in one fixed location.

### `Expertise.tsx`
Tag chip grid — 12 disciplines (Visual Merchandising, Window Design, Mannequin Styling, etc.) as bordered uppercase mono chips.

### `Contact.tsx`
Index strip + `WRITE` label + oversized uppercase email. On desktop it's a single non-wrapping line `HELLO@GEORDINZOLLIECOFFER.COM`; on mobile it intentionally breaks into three lines (`HELLO@` / `GEORDINZOLLIECOFFER` / `.COM`) so the type stays large and the link still reads as one giant tap target. `@` and `.` are signal-blue in both modes. Three-column metadata footer below, stacked with hairline dividers on mobile.

### `Footer.tsx`
One thin row: mark · index · ©2026 · email.

---

## 9. Image pipeline

Source files (HEIC from iPhone, JPG, PNG screenshots) live in `../kith/` and `../nordstrom/`. The script `../convert-media-v2.sh` handles conversion:

```bash
# For each source file:
ffmpeg -i src.HEIC -q:v 2 /tmp/rotated.jpg     # ffmpeg auto-rotates per EXIF, bakes into pixels
cwebp -q 82 -resize 2400 0 -metadata none /tmp/rotated.jpg -o out.webp
```

Key details:
- **`ffmpeg` first, not just `sips`** — sips preserves the EXIF `rotation=-90` tag without rotating pixel data, which browsers then misinterpret. ffmpeg bakes orientation into pixel data so the webp always renders correctly
- **`-metadata none`** on cwebp — strips EXIF entirely so no rotation tag can ever interfere
- **Long-edge cap at 2400 px** — never upscale; portrait images get `-resize 0 2400`, landscape get `-resize 2400 0`
- Output goes to `../staged/work/` — that folder is what gets copied into `public/images/work/` and also what would `rclone copy` to R2 if the bucket gets wired up

Filename pattern: `{project-slug}-still-{n}.webp` (1-indexed). The Lightbox caption parser depends on this — don't deviate.

---

## 10. Where to edit common things

### Bio / project copy
- Masthead bio: `src/sections/HeroMosaic.tsx` (the `<p>` inside the "Currently —" row)
- About manifesto: `src/sections/About.tsx` (the `<h2>` and the two body paragraphs)
- Case study overview / deliverables / results: `src/data/projects.ts` (per project, in `caseStudy`)
- Page title / role / location: usually `src/data/resume.ts` (`identity.roles`)
- Email everywhere: search for `hello@geordinzolliecoffer.com` (used in `Contact.tsx`, `Footer.tsx`, `Nav.tsx`, `resume.ts`)

### Colors / fonts
- `tailwind.config.ts` for the token values
- `src/styles/globals.css` for the matching CSS vars (kept in sync so legacy refs still work)

### Add a new image to an existing project
1. Drop the source into `../kith/` or `../nordstrom/`
2. Run `../convert-media-v2.sh` (clears `staged/work` first and re-converts everything from scratch — see Section 11 for fixing if you want incremental)
3. Copy the new file(s) into `geordin-portfolio/public/images/work/`
4. Append the new filename to that project's `caseStudy.images[]` in `src/data/projects.ts`
5. Optionally update `featured[]` (homepage 4-image mosaic) if it should appear there
6. **Run `npm run measure-images`** to refresh the dimensions manifest at the bottom of `src/data/projects.ts` (powers the mobile justified gallery — without this, new images fall back to a 4:3 placeholder ratio)
7. Deploy (Section 11)

### Add a new project
1. Add the source images, convert + name them `{new-slug}-still-{n}.webp`
2. Add a new entry to `projects` array in `src/data/projects.ts`
3. Add a label to `PROJECT_LABELS` in `src/components/SectionNav.tsx`
4. Verify the `metaFromSrc()` lookup works (it auto-matches based on slug — should just work)
5. Deploy

### Change which 4 images appear in a homepage chapter
Edit the `featured[]` array for that project in `src/data/projects.ts`. First entry is the lead (large), next three are the side stack.

### Change the masthead slideshow images
`src/sections/HeroMosaic.tsx` — the `slideshowImages` array (6 entries currently).

### Change Page-header carousel (Work / About / Contact)
Each page builds it as `projects.flatMap((p) => p.featured.slice(0, N))`. Change `N` per page if you want fewer/more images.

### Tweak section-nav labels
`src/components/SectionNav.tsx` — the `PROJECT_LABELS` map for project chapters; the `SECTIONS` array for everything else.

### Update the ScrollFlow orb
`src/components/ScrollFlow.tsx` — gradient stops in the `<radialGradient>`, blur intensity in the `<feGaussianBlur>` stdDeviation, motion curves at the `useTransform` calls.

---

## 11. Deploy workflow

The container on homelab is the source of truth for "what's live". To deploy a code change:

```bash
# 1. Edit locally on this Mac
# 2. Sync src/ (and other relevant top-level files) to homelab
rsync -avz --exclude='node_modules' --exclude='dist' --exclude='.git' \
  "/Users/brendoncarbullido/Downloads/Geordin Zolliecoffer/geordin-portfolio/src/" \
  homelab:apps/geordin-portfolio/src/

# Image changes also need:
rsync -avz \
  "/Users/brendoncarbullido/Downloads/Geordin Zolliecoffer/geordin-portfolio/public/images/work/" \
  homelab:apps/geordin-portfolio/public/images/work/

# 3. Rebuild + restart the container (takes ~3 seconds)
ssh homelab "cd ~/apps/geordin-portfolio && docker compose up -d --build"
```

The browser doesn't need to be reloaded immediately — nginx's cache-control on `index.html` is `no-cache, must-revalidate` so the next request picks up the new hashed asset URLs.

### One-shot deploy script (useful)
```bash
# Save as ~/deploy-gz.sh on this Mac for convenience
#!/usr/bin/env bash
set -e
LOCAL="/Users/brendoncarbullido/Downloads/Geordin Zolliecoffer/geordin-portfolio"
rsync -avz --delete --exclude='node_modules' --exclude='dist' --exclude='.git' \
  --exclude='.DS_Store' --exclude='.claude' --exclude='Open Portfolio.command' \
  "$LOCAL/" homelab:apps/geordin-portfolio/
ssh homelab "cd ~/apps/geordin-portfolio && docker compose up -d --build"
echo "Deployed. http://homelab:8080"
```

### Container management (run on homelab via ssh)
```bash
cd ~/apps/geordin-portfolio

docker compose ps              # status
docker logs -f geordin-portfolio  # tail nginx logs (10 MB rotation, 3 files)
docker compose restart         # restart (keep existing image)
docker compose down            # stop + remove
docker compose up -d           # start (existing image)
docker compose up -d --build   # rebuild image from source, restart
docker exec -it geordin-portfolio sh   # shell into running container
```

---

## 12. Local development (optional)

The container is production. For active iteration you can also run vite dev on this Mac:

```bash
cd "/Users/brendoncarbullido/Downloads/Geordin Zolliecoffer/geordin-portfolio"
npm install
npm run dev    # → http://localhost:5173 (or 5174)
```

With `VITE_USE_LOCAL_MEDIA=1` in `.env.local`, dev serves images from `public/images/work/` (same as the container).

Build check before deploy:
```bash
npm run build  # tsc -b && vite build → dist/  (~1s, ~206 KB gzipped main bundle)
```

---

## 13. Lightbox / caption conventions

The lightbox derives its caption from the image filename. So **the filename matters** — keep the pattern `{project-slug}-still-{n}.webp`. If you ever rename a file to break that pattern, the lightbox will fall back to the `alt` text.

The caption renders three lines:
1. `client` (extrabold, e.g. "Kith West Hollywood")
2. `title` (medium, e.g. "A New Flagship on Sunset")
3. `Category · Year` (mono caps, e.g. "Flagship Opening · 2024")

No "Plate X" — that was removed by request.

---

## 14. The `Open Portfolio.command` shortcut

`geordin-portfolio/Open Portfolio.command` is a double-clickable bash script.

Behavior:
1. Probes `http://homelab:8080/`
2. If container is up → opens the URL in default browser
3. If down → runs `docker compose up -d` over SSH, waits up to 30s for it to come up, opens browser

Terminal stays attached so you can read status. Press return to close.

If macOS Gatekeeper prompts on first run: right-click → Open → Open (one-time approval).

---

## 15. Known caveats / open follow-ups

1. **Domain not wired up.** Geordin owns `geordinzolliecoffer.com` (per the original brief) but DNS isn't pointed anywhere yet. When she's ready: stand up a Vercel/Cloudflare Pages deployment of the same `dist/` output, OR put homelab behind a Cloudflare Tunnel and point her domain at it. Email (`hello@geordinzolliecoffer.com`) also needs Cloudflare Email Routing → her gmail.
2. **R2 not wired up.** The `media.ts` helper still supports R2 via `VITE_MEDIA_URL` — flipping `VITE_USE_LOCAL_MEDIA=0` after creating the `geordin-portfolio-media` bucket (per the playbook §6) would offload bandwidth. Until then everything's served from the container's `public/`.
3. **NBA All-Star photo is 326 KB at source** — `kith-sunset-still-9.webp`. May look soft if expanded. Replace with a higher-res source if she has one.
4. **`sections/Process.tsx` still exists but isn't mounted anywhere.** Safe to delete; left in case the Method section ever comes back.
5. **`experience[]` data in `resume.ts` is unused** — the Experience timeline section was removed by request. Data still there as a content reference.
6. **Bio copy is first-person, drafted.** Geordin should sign off before any real launch.
7. **No OG image at `public/og.jpg`** — referenced in `index.html` meta but the file doesn't exist. Generate a 1200×630 cover image and drop it in `public/`.
8. **Default mobile experience** — site is responsive but the section nav and scroll flow are desktop-only (`hidden md:block`). Mobile is intentional minimum-viable.
9. **CaseStudyPage.tsx is just a re-export of CaseStudy.tsx.** The router imports `CaseStudyPage`. Don't be confused.

---

## 16. Original brief

The original setup brief from Brendon — including the playbook for forking createdbybc.com, R2 conventions, ffmpeg patterns, etc. — lives at the parent folder: `/Users/brendoncarbullido/Downloads/Geordin Zolliecoffer/portfolio-template-playbook.md`. Useful background context but **this HANDOFF.md supersedes it for the current Geordin build** — the visual design has drifted very far from the template.

---

## 17. Quick smoke test for a fresh session

To confirm everything's still working after a restart, in order:

```bash
# 1. Container is running and healthy
ssh homelab "docker ps --filter name=geordin-portfolio --format '{{.Status}}'"
# Expect: "Up X minutes (healthy)"

# 2. HTTP works on Tailscale
curl -sI http://homelab:8080/ | head -1
# Expect: HTTP/1.1 200 OK

# 3. SPA fallback works
curl -s http://homelab:8080/work/kith-sunset | grep '<title>'
# Expect: <title>Geordin Zolliecoffer — Visual Merchandising</title>

# 4. Asset works
curl -sI http://homelab:8080/images/work/kith-west-hollywood-still-5.webp | head -1
# Expect: HTTP/1.1 200 OK

# 5. Local build still passes
cd "/Users/brendoncarbullido/Downloads/Geordin Zolliecoffer/geordin-portfolio" && npm run build
# Expect: ✓ built in ~1s
```

If all five pass, the system is healthy. Open the URL in any browser on any tailnet/LAN device to use the site.

---

## 18. Mobile Redesign — Gate Log

**Status:** Shipped 2026-05-13. Single commit on `main` (`489de21`). Post-merge iPhone smoke test clean. The `mobile-redesign` branch was fast-forwarded into `main` and deleted; no separate branch reference exists anymore.

The mobile-first redesign was executed over 9 gates (+ Gate 5.5 reverted, + Gate 7.5 dedup), each iPhone-validated over Tailscale before moving to the next. Below is the provenance the missing per-gate git commits would otherwise carry.

**Discipline (set at Gate 1, held throughout):**
- Desktop ≥768px must remain byte-identical. Verified by `scripts/baseline/capture.mjs` puppeteer-driven captures diffed via `pixelmatch`. Threshold 0.1% for stable pages; `VISUAL_NOISY` set covers pages with inherent layout jitter (column-count masonry, scroll-driven parallax, all mobile pages during active redesign).
- Each gate ended with deploy to homelab + iPhone test via Tailscale before continuing. No queued mobile bugs.
- Mobile/desktop split via `useMediaQuery('(min-width: 768px)')` (the HEAD-resident hook restored at Gate 1) — fork into separate components when layouts diverge structurally; `md:` overrides only when the desktop branch is unaffected.

**Gate 1 — Baselines + scaffolding.**
Branched `mobile-redesign` from current dirty `main`. Restored `src/hooks/useMediaQuery.ts` from HEAD (the working tree had it deleted). Created `src/components/MobileProgress.tsx` — fixed top progress bar with active-section label, `md:hidden`, mounted alongside `SectionNav`. Built `scripts/baseline/capture.mjs` — puppeteer-core + pixelmatch + pngjs. Determinism took multiple iterations: image-decode race, `setInterval` freeze for `HeroSlideshow`, `evaluateOnNewDocument` priming of `sessionStorage` to skip the IntroLoader. Settled on 5-consecutive-run validation. Final baselines locked across 16 PNGs (8 routes × 2 viewports).

**Gate 2 — Nav refinement + Masthead split.**
`HeroMosaic.tsx` left untouched; created `src/sections/HeroMosaicMobile.tsx` — full-bleed slideshow at `h-[60vh]`, stacked GEORDIN/ZOLLIECOFFER names without `mix-blend-multiply`, vertical metadata stack with status pill, scroll cue. `HomePage.tsx` switches between the two via `useMediaQuery`. Refined `Nav.tsx` in place: base = solid `bg-paper/95 backdrop-blur-sm` + ink text, `md:` restores mix-blend-difference. Drawer: full-screen ink, mono section numbers (`01 WORK` / `02 ABOUT` / `03 CONTACT`), slide-down enter/exit. Added 2 backward-compatible props to `HeroSlideshow.tsx`: `aspect` (empty = no constraint), `dotsAtBottom`. Desktop diff: 0.000% on all stable pages.

**Gate 3 — WorkGrid mobile chapter strips + Nav reduced-motion + ESC.**
`MosaicCollage.tsx` left untouched; created `src/components/ChapterStripMobile.tsx` — sticky chapter index strip, horizontal `snap-x snap-mandatory` gallery at `w-[85vw] h-[55vh]` with ~12% edge peek, per-plate `whileInView` spring. `WorkGrid.tsx` switches per project via `useMediaQuery`. Backfilled `useReducedMotion` gating in `Nav.tsx` (drawer slide collapses to fade, link stagger zeros out). Added ESC key handler. Desktop: byte-identical (mobile fork pattern works).

**Gate 4 — About + Expertise + Contact section refinements.**
Refined in place with `md:` overrides. About: added static mobile-only signal-blue blur shape behind the manifesto headline (watercolor motif). Expertise: `grid grid-cols-2` with full-width centered chips at base, `flex flex-wrap` at `md:` — `md:group-hover:` for desktop fill, `active:underline` decorative tap state for mobile. Contact: email breaks to three lines (`HELLO@` / `GEORDINZOLLIECOFFER` / `.COM`) on base via `<span class="block md:inline">`, single line at `md:`. Metadata footer flex-stacks with hairlines on base, 3-col at `md:`. Footer: 2-row mobile layout. **Mid-gate snag**: a Footer `safe-area-inset-bottom` inline style accidentally shrank desktop by 8 px on every page — caught by the diff, removed (Footer isn't fixed-bottom so safe-area isn't required). Contact email font-size initially overflowed at 390 px viewport; tightened the clamp. Tooling: extended `VISUAL_NOISY` to all mobile pages (the redesign IS the work — mobile gets visual review, not diff).

**Gate 5 — `/work` + `/work/:slug` justified gallery (mobile).**
Built `scripts/measure-images.mjs` — reads every `public/images/work/*.webp` via `image-size`, writes an `imageDimensions` map between auto-gen sentinels at the bottom of `src/data/projects.ts`. Created `src/components/GalleryStripMobile.tsx` — hand-rolled row packer, target row height ~32vh, range 22vh–38vh, gap-2, orphan rows left-aligned at target height. Mobile rows compute from the build-time manifest (no `new Image()` probing). Applied to `WorkPage.tsx` and `CaseStudy.tsx` via `useMediaQuery`. Desktop column-masonry on both pages untouched. **Mid-gate algorithm bug**: first pack solver clamped row heights up to `minH` when natural h fell below, producing widths summing > container — horizontal page overflow. Fixed by backing out the offending image (push to next row) when adding would drop h below minH; capped at `maxH` only; switched all rows to `flex justify-start`. Mobile case-study page heights dropped 25–39% vs. column-masonry baseline.

**Gate 5.5 — Lightbox shared-element transition (REVERTED).**
Attempted `layoutId`-based grid→modal morph in `Lightbox.tsx`. Framer-motion required disappear-then-appear semantics to fire the transition; first attempt with both elements mounted didn't animate. Added placeholder-swap pattern + `openSrc` context — morph worked on desktop, broke body scroll-lock on iOS Safari (close left `position: fixed` body in stuck state). Attempted scroll-lock hardening via `useLayoutEffect` + `position: fixed; top: -scrollY`. User pulled the plug; reverted Lightbox.tsx wholesale to pre-Gate-5.5 state (instant open/close, simple `body.style.overflow = 'hidden'` lock — confirmed working on iOS). Shared-element transition is permanently off the table.

**Gate 6 — Case study mobile chrome (`/work/:slug`).**
`CaseStudy.tsx` only. Forked hero: mobile gets `h-[70vh] w-full object-cover` LightboxImage with category eyebrow + title overlaid at bottom inside `bg-gradient-to-t from-ink/90 via-ink/55 to-transparent`, `textShadow` belt-and-suspenders for legibility across all 3 case studies' lead images. 2-col metadata strip below hero (Client / Role / Year / Category, hairline rules). Existing 4-col desktop metadata `hidden md:grid`. Deliverables + Results: `flex items-baseline gap-3` with mono number on mobile (`md:hidden`) + dash on desktop (`hidden md:inline-block`); multi-line items align past number not under it. Next-project CTA forked: desktop ink-inverse dramatic section, mobile hairline-bordered tap target with arrow.

**Gate 7 — `/about` + `/contact` page chrome (carousel dim).**
Two-line prop change: mobile `HeaderCarousel` on both pages drop `dimmed={false}` → use default (true, 0.5 opacity) to match desktop dim treatment per spec. Group isolation verified (carousel's `about-header` / `contact-header` groups never bled into the About section's manifesto image group).

**Gate 7.5 — Carousel dedup (lightbox counter fix).**
Pre-7.5 the mobile `md:hidden` carousel and desktop `hidden md:block` carousel were both mounted (CSS-only hidden), both registering their 6 `LightboxImage` children with the same `about-header` / `contact-header` / `work-header` group. Lightbox counter showed "01 / 12" instead of "01 / 06"; navigation cycled each image twice. Fixed by switching `AboutPage.tsx`, `ContactPage.tsx`, `WorkPage.tsx` to `useMediaQuery`-conditional mount (only the visible carousel renders). Counter now reads correctly. Desktop diff: 0.000%.

**Gate 8 — Lightbox mobile gestures.**
`Lightbox.tsx` only. `useRef`-tracked touchStart, `(max-width: 767px)` gated `onTouchStart` / `onTouchEnd` on the modal backdrop. Swipe left/right (≥50 px, horizontal-dominant) → step ±1. Swipe down (≥100 px, vertical-dominant) → close. `visualViewport.scale > 1.05` bails out so single-finger pan of a zoomed image doesn't get read as a swipe; `touchStartRef.current = null` unconditionally cleared at top of `onTouchEnd` so no stale state can leak between gestures. Pinch is browser-native via `touch-action: pinch-zoom` on the `<img>` + `touch-action: pan-y` on the modal wrapper. Desktop ←/→/ESC keyboard nav untouched. No useReducedMotion gate (gestures are discrete actions, not animations). Scroll-lock untouched.

**Gate 9 — Final pass.**
Lighthouse mobile run on `/work/kith-west-hollywood` flagged `CLS 0.276` — well above the 0.1 threshold. Traced to `<Footer />` being always-mounted while routes were `lazy()` inside `Suspense fallback={null}` — Footer rendered near y=0 during the chunk-loading window, jumped to y≈8320 once the route mounted. Fix: eager-imported all 5 routes in `App.tsx`, removed `Suspense`. Post-fix Lighthouse: **CLS 0** on both pages. Cost: +3.03 kB gzipped to main bundle. Also fixed an earlier `GalleryStripMobile.tsx` initial-render gap (containerWidth started at 0 → empty rows on first paint) by seeding from `window.innerWidth`.

---

## 19. Rollback (post-launch)

Git tagging was skipped intentionally — the pre-redesign git history points at the bare-template state which is not a useful rollback target. The functional rollback is at the Docker image level on homelab.

**Pre-redesign Docker image is tagged as `geordin-portfolio-portfolio:pre-redesign`** on homelab (created `2026-05-13` immediately before the redesign was deployed).

To roll back the live site to the pre-redesign state:

```bash
ssh homelab "docker tag geordin-portfolio-portfolio:pre-redesign geordin-portfolio-portfolio:latest && cd ~/apps/geordin-portfolio && docker compose up -d"
```

This re-tags the `:pre-redesign` image as `:latest` and restarts the container against it — no rebuild from source needed. Site returns to the previous mobile-minimum-viable state within ~3 seconds. Note: `docker compose up -d --build` would override this by rebuilding from current source, so don't use `--build` during rollback.

To verify rollback worked:
```bash
ssh homelab "docker ps --filter name=geordin-portfolio --format '{{.Status}} {{.Image}}'"
curl -sI http://homelab:8080/ | head -1
```

The pre-redesign image stays around indefinitely unless explicitly removed (`docker image rm geordin-portfolio-portfolio:pre-redesign`). Keep it.

---

## 20. Post-launch follow-ups

Open items deferred from Gate 9, to revisit once a domain is wired:

1. **Hero image `fetchpriority="high"`** — Lighthouse LCP on `/work/:slug` mobile reported ~5s (homelab + Tailscale + simulated throttling). Adding `fetchpriority="high"` to the case-study hero `<LightboxImage>` should drop it materially. Not user-facing on real iPhone-over-Tailscale (Tailscale RTT dominates), but worth doing once on a real CDN.
2. **Re-run Lighthouse on the real CDN** — current numbers are against homelab nginx through Tailscale, which inflates both LCP and SI vs. what real users on Cloudflare/Vercel will see. Once `geordinzolliecoffer.com` is pointed somewhere, run a fresh Lighthouse and capture the real numbers.

---

**You can now make changes confidently. Welcome to the Geordin portfolio.**
