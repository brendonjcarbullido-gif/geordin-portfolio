#!/usr/bin/env node
/**
 * Mobile-redesign baseline capture + diff.
 *
 * Drives the local Vite dev server via puppeteer-core (system Chrome).
 * `evaluateOnNewDocument` pre-sets sessionStorage to skip IntroLoader.
 * Captures full-page PNGs for each route across two viewports.
 *
 *   node scripts/baseline/capture.mjs capture --out .baseline-screenshots
 *   node scripts/baseline/capture.mjs capture --out .current-screenshots
 *   node scripts/baseline/capture.mjs diff \
 *        --before .baseline-screenshots --after .current-screenshots \
 *        --report .diff-report --threshold 0.05
 *
 * Capture exits 0 on success; diff exits 1 if any pair exceeds threshold.
 */

import { mkdir, readdir, rm, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..', '..')

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE_URL = process.env.BASELINE_URL ?? 'http://localhost:5174'

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'work', path: '/work' },
  { name: 'work-kith-west-hollywood', path: '/work/kith-west-hollywood' },
  { name: 'work-kith-sunset', path: '/work/kith-sunset' },
  { name: 'work-nordstrom-thousand-oaks', path: '/work/nordstrom-thousand-oaks' },
  { name: 'about', path: '/about' },
  { name: 'contact', path: '/contact' },
  { name: 'notfound', path: '/this-route-does-not-exist' },
]

// Pages with inherent run-to-run noise: tagged "warn" but don't fail the
// diff exit code. Keyed `${viewportId}/${filename}`.
//
// Desktop entries are pages with column-count masonry (image natural heights
// flow columns non-deterministically) or scroll-driven parallax. These are
// also the pages we don't have a tight visual contract on.
//
// All mobile entries are noisy by design: the mobile redesign IS the work
// each gate does, so mobile pixel/size mismatches against the Gate-1
// baseline are expected, not regressions. The diff's primary signal is
// desktop preservation (must stay 0.000% on non-noisy desktop pages).
// Mobile gets visual + device review at Gate 9 instead.
const VISUAL_NOISY = new Set([
  // Desktop column-count masonry (/work archive + 3 case studies)
  'desktop-1280/work.png',
  'desktop-1280/work-kith-west-hollywood.png',
  'desktop-1280/work-kith-sunset.png',
  'desktop-1280/work-nordstrom-thousand-oaks.png',
  // Desktop MosaicCollage scroll-driven parallax on the homepage
  'desktop-1280/home.png',
  // All mobile pages — being redesigned gate-by-gate
  'mobile-390/home.png',
  'mobile-390/about.png',
  'mobile-390/contact.png',
  'mobile-390/notfound.png',
  'mobile-390/work.png',
  'mobile-390/work-kith-west-hollywood.png',
  'mobile-390/work-kith-sunset.png',
  'mobile-390/work-nordstrom-thousand-oaks.png',
])

const VIEWPORTS = [
  { id: 'desktop-1280', width: 1280, height: 800 },
  { id: 'mobile-390', width: 390, height: 844, deviceScaleFactor: 2 },
]

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : fallback
}
function hasFlag(name) {
  return process.argv.includes(`--${name}`)
}

async function waitForServer(url, attempts = 30) {
  for (let i = 0; i < attempts; i++) {
    try {
      const r = await fetch(url)
      if (r.ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`Dev server not responding at ${url}`)
}

async function capture(outDir) {
  await waitForServer(BASE_URL)
  await mkdir(outDir, { recursive: true })

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: null,
    protocolTimeout: 120000,
    args: ['--no-sandbox', '--hide-scrollbars', '--disable-gpu'],
  })

  try {
    for (const vp of VIEWPORTS) {
      const vpDir = join(outDir, vp.id)
      await mkdir(vpDir, { recursive: true })

      for (const route of ROUTES) {
        const page = await browser.newPage()
        await page.setViewport({
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: vp.deviceScaleFactor ?? 1,
        })
        // Disable motion + skip the IntroLoader so captures are stable.
        await page.emulateMediaFeatures([
          { name: 'prefers-reduced-motion', value: 'reduce' },
        ])
        await page.evaluateOnNewDocument(() => {
          try {
            sessionStorage.setItem('gz-intro-seen', '1')
          } catch {}
          // No-op setInterval from page init so any component (e.g.
          // HeroSlideshow's crossfade) can't auto-advance frames between
          // capture runs. setTimeout is left alone — section observers
          // and one-shot effects rely on it.
          window.setInterval = () => 0
        })

        const url = `${BASE_URL}${route.path}`
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })

        // Force every <img loading="lazy"> to "eager" so they start loading
        // immediately. Otherwise they'd only start during scroll and the
        // per-image await below could hang.
        await page.evaluate(() => {
          for (const img of document.images) img.loading = 'eager'
        })

        // Scroll through the page once to trigger any viewport-gated motion
        // / IntersectionObserver-based loaders, then return to top.
        await page.evaluate(async () => {
          const step = window.innerHeight
          const total = document.documentElement.scrollHeight
          for (let y = 0; y < total; y += step) {
            window.scrollTo(0, y)
            await new Promise((r) => setTimeout(r, 50))
          }
          window.scrollTo(0, 0)
        })

        // Wait for every <img> to fire `load` (with per-image timeout so a
        // stuck image can't block the whole capture).
        await page.evaluate(() => Promise.all(
          [...document.images].map((img) => {
            if (img.complete && img.naturalWidth > 0) return null
            return new Promise((resolve) => {
              const done = () => resolve()
              img.addEventListener('load', done, { once: true })
              img.addEventListener('error', done, { once: true })
              setTimeout(done, 8000)
            })
          }),
        ))

        // All-image decode wait. column-count masonry reflows on every image's
        // intrinsic dimensions, so this MUST happen before the settle below —
        // otherwise layout computes against a partially-decoded set and
        // jitters between runs.
        await page.evaluate(() =>
          Promise.all(
            [...document.images].map((img) => img.decode().catch(() => {})),
          ),
        )

        // Force a synchronous layout pass so column-masonry recomputes with
        // every image at its final intrinsic dimensions.
        await page.evaluate(() => {
          void document.body.offsetHeight
        })

        // Two animation frames so paint settles after the forced layout.
        await page.evaluate(() => new Promise((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        }))

        // Settle: section observers in SectionNav / MobileProgress run on a 250ms timer.
        // (setInterval is already a no-op from evaluateOnNewDocument.)
        await new Promise((r) => setTimeout(r, 1200))

        const file = join(vpDir, `${route.name}.png`)
        await page.screenshot({ path: file, fullPage: true })
        process.stdout.write(`captured ${vp.id}/${route.name}.png\n`)
        await page.close()
      }
    }
  } finally {
    await browser.close()
  }
}

async function loadPng(path) {
  const buf = await readFile(path)
  return PNG.sync.read(buf)
}

async function diff({ beforeDir, afterDir, reportDir, threshold }) {
  if (!existsSync(beforeDir)) {
    process.stderr.write(`error: before dir not found: ${beforeDir}\n`)
    process.exit(2)
  }
  if (!existsSync(afterDir)) {
    process.stderr.write(`error: after dir not found: ${afterDir}\n`)
    process.exit(2)
  }
  await mkdir(reportDir, { recursive: true })
  const summary = []
  let failures = 0

  const vpDirs = (await readdir(beforeDir, { withFileTypes: true }))
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  if (vpDirs.length === 0) {
    process.stderr.write(`error: no viewport subdirs in ${beforeDir}\n`)
    process.exit(2)
  }

  for (const vp of vpDirs) {
    const beforeFiles = (await readdir(join(beforeDir, vp))).filter((f) => f.endsWith('.png'))
    for (const file of beforeFiles) {
      const beforePath = join(beforeDir, vp, file)
      const afterPath = join(afterDir, vp, file)
      if (!existsSync(afterPath)) {
        summary.push({ vp, file, status: 'missing-after' })
        failures++
        continue
      }
      const before = await loadPng(beforePath)
      const after = await loadPng(afterPath)
      if (before.width !== after.width || before.height !== after.height) {
        const noisy = VISUAL_NOISY.has(`${vp}/${file}`)
        summary.push({
          vp, file,
          status: noisy ? 'warn-noisy-size' : 'size-mismatch',
          before: `${before.width}x${before.height}`,
          after: `${after.width}x${after.height}`,
        })
        if (!noisy) failures++
        continue
      }
      const diffPng = new PNG({ width: before.width, height: before.height })
      const mismatched = pixelmatch(
        before.data, after.data, diffPng.data,
        before.width, before.height,
        { threshold: 0.1, includeAA: false },
      )
      const total = before.width * before.height
      const ratio = mismatched / total
      const noisy = VISUAL_NOISY.has(`${vp}/${file}`)
      let status
      if (ratio <= threshold) status = 'pass'
      else if (noisy) status = 'warn-noisy'
      else status = 'fail'
      const result = {
        vp, file,
        mismatched, total, ratio: Number(ratio.toFixed(6)),
        status,
      }
      summary.push(result)
      if (status !== 'pass') {
        if (status === 'fail') failures++
        const outVpDir = join(reportDir, vp)
        await mkdir(outVpDir, { recursive: true })
        await writeFile(join(outVpDir, file), PNG.sync.write(diffPng))
      }
    }
  }

  await writeFile(
    join(reportDir, 'summary.json'),
    JSON.stringify(summary, null, 2),
  )

  const printable = summary.map((s) => {
    if (s.status === 'pass') return `  ok    ${s.vp}/${s.file}  (${(s.ratio * 100).toFixed(3)}%)`
    if (s.status === 'warn-noisy') return `  warn  ${s.vp}/${s.file}  (${(s.ratio * 100).toFixed(3)}%) — known noisy page, review manually`
    if (s.status === 'warn-noisy-size') return `  warn  ${s.vp}/${s.file}  size ${s.before} → ${s.after} — known noisy page, review manually`
    return `  FAIL  ${s.vp}/${s.file}  ${JSON.stringify(s)}`
  }).join('\n')
  if (summary.length === 0) {
    process.stderr.write(`error: no PNG pairs compared\n`)
    process.exit(2)
  }
  process.stdout.write(`\n${printable}\n\n`)
  process.stdout.write(`Compared ${summary.length}.  Threshold: ${threshold}.  Failures: ${failures}.\n`)
  if (failures > 0) process.exitCode = 1
}

const cmd = process.argv[2]
if (cmd === 'capture') {
  const out = arg('out', join(REPO_ROOT, '.baseline-screenshots'))
  if (hasFlag('clean') && existsSync(out)) await rm(out, { recursive: true, force: true })
  await capture(out)
} else if (cmd === 'diff') {
  const beforeDir = arg('before', join(REPO_ROOT, '.baseline-screenshots'))
  const afterDir = arg('after', join(REPO_ROOT, '.current-screenshots'))
  const reportDir = arg('report', join(REPO_ROOT, '.diff-report'))
  // Default threshold 0.1% for non-masonry pages — verified stable across 5
  // consecutive runs. The column-count masonry pages (see MASONRY_NOISY) are
  // tagged "warn" instead of "fail" because their column flow is inherently
  // jittery between runs; review those manually at gate review time.
  const threshold = parseFloat(arg('threshold', '0.001'))
  await diff({ beforeDir, afterDir, reportDir, threshold })
} else {
  process.stdout.write(
    'usage: capture.mjs capture [--out <dir>] [--clean]\n' +
    '       capture.mjs diff [--before <dir>] [--after <dir>] [--report <dir>] [--threshold <ratio>]\n',
  )
  process.exit(2)
}
