# Geordin Zolliecoffer — Portfolio

Personal portfolio for **Geordin Zolliecoffer**, Lead Visual Merchandiser (Los Angeles).

**Stack:** React 18 · Vite · TypeScript · Tailwind v3 · Framer Motion. Media served from `public/` locally and from Cloudflare R2 in production.

---

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173 (or 5174 if shortcut)
npm run build    # tsc -b && vite build → dist/
npm run preview  # serve the production build
```

`.env.local` controls the media source:

```
VITE_MEDIA_URL=https://pub-XXXX.r2.dev   # set after R2 bucket is up
VITE_USE_LOCAL_MEDIA=1                   # 1 → serve from /public/, 0 → R2
```

Out of the box `VITE_USE_LOCAL_MEDIA=1` so the site runs from `public/images/work/` without R2.

To launch the dev server on the homelab box and open the browser in one click, double-click [`Open Portfolio.command`](./Open%20Portfolio.command) from Finder. SSHes into homelab, runs `npm run dev`, opens `http://homelab:5174`.

---

## Architecture

```
src/
├── App.tsx                  # router + LightboxProvider
├── main.tsx
├── components/
│   ├── Lightbox.tsx         # global click-to-expand image viewer
│   ├── Nav.tsx              # top mono strip (mix-blend-difference)
│   ├── ScrollToTop.tsx
│   └── motion/
│       ├── Cursor.tsx       # custom crosshair cursor (desktop only)
│       ├── IntroLoader.tsx  # first-visit black curtain
│       └── RouteCurtain.tsx # route-change panel wipe
├── data/
│   ├── projects.ts          # 3 case studies (Kith WeHo, Kith Sunset, Nordstrom)
│   └── resume.ts            # bio, experience, education (used by About page)
├── lib/
│   ├── media.ts             # image()/video() resolvers (R2 + local fallback)
│   └── preloadAssets.ts     # asset preload list
├── pages/
│   ├── HomePage.tsx         # masthead → work → about → method → contact
│   ├── WorkPage.tsx         # all chapters, no masthead
│   ├── CaseStudy(Page).tsx  # /work/:slug case study
│   ├── AboutPage.tsx        # full bio + experience + education
│   ├── ContactPage.tsx
│   └── NotFoundPage.tsx
├── sections/
│   ├── HeroMosaic.tsx       # masthead (oversized name + featured image)
│   ├── WorkGrid.tsx         # 3-chapter magazine stack
│   ├── About.tsx            # ink-inverse manifesto + bio
│   ├── Expertise.tsx        # tag-chip capabilities
│   ├── Process.tsx          # 4-step Method
│   ├── Contact.tsx          # oversized email block
│   └── Footer.tsx
└── styles/globals.css
```

**Design tokens** (in `tailwind.config.ts`): paper `#F6F4EF` · ink `#0E0E0E` · ink-soft `#8A8780` · signal `#3D4F8A` · hairline `rgba(14,14,14,.14)`.

**Type:** Inter Tight (display + body) · JetBrains Mono (labels). Both Google Fonts.

---

## Media pipeline

Source HEIC/JPEG/PNG live in `../kith/` and `../nordstrom/` next to this repo. The script [`../convert-media-v2.sh`](../convert-media-v2.sh) bakes EXIF orientation into pixel data via ffmpeg, then encodes webp via cwebp at q82 with `-metadata none` (so browsers never have to honour EXIF):

```bash
ffmpeg -i src.JPEG -q:v 2 /tmp/rotated.jpg     # auto-rotate
cwebp -q 82 -resize 2400 0 -metadata none /tmp/rotated.jpg -o dest.webp
```

Output lives in `../staged/work/` and is mirrored into `public/images/work/`.

---

## Click-to-expand lightbox

Every image on the site goes through [`<LightboxImage src={...} group="kith-sunset" />`](src/components/Lightbox.tsx). Images sharing a `group` value (the project slug) are arrow-key navigable. ESC or backdrop click closes.

---

## Deploy

1. **R2 bucket** — create `geordin-portfolio-media`, set CORS to allow her domain + Vercel previews, copy public dev URL into `VITE_MEDIA_URL`.
2. **Upload assets** — `rclone copy ../staged/work/ geordin-r2:images/work/ --progress`.
3. **Vercel** — connect the GitHub repo, set `VITE_MEDIA_URL` + `VITE_USE_LOCAL_MEDIA=0` in env vars, deploy.
4. **Domain** — point `geordinzolliecoffer.com` A/CNAME at Vercel.
5. **Email** — Cloudflare Email Routing for `hello@geordinzolliecoffer.com` → her gmail.

---

## Open follow-ups before launch

1. Hard numbers for case study `results[]` if available — currently qualitative.
2. NBA All-Star photo (kith-sunset-still-9) is 326KB source — consider higher-res if she has one.
3. WeHo gallery is 25 stills — trim to the strongest 9–12 if desired.
4. OG image at `public/og.jpg` needs a 1200×630 design.
5. Bio copy in `HeroMosaic.tsx` and `About.tsx` is first-person, needs her sign-off.
