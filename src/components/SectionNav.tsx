import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { projects } from '@/data/projects'

/**
 * SectionNav — fixed vertical nav strip on the right edge, centered. Tracks
 * which page section is currently in view via IntersectionObserver and
 * scrolls smoothly when a section is clicked.
 *
 * The strip scans the DOM for any of the SECTIONS ids that exist on the
 * current route, so it adapts page-by-page (homepage shows the major
 * sections; /work shows each project chapter; deeper pages show whatever
 * matches).
 *
 * Hidden on mobile (no room to layer beside the page).
 */

/** Short labels for the nav — full project names would overflow. */
const PROJECT_LABELS: Record<string, string> = {
  'kith-west-hollywood': 'Kith W.H.',
  'kith-sunset': 'Kith Sunset',
  'nordstrom-thousand-oaks': 'Nordstrom',
}

const SECTIONS: Array<{ id: string; label: string }> = [
  { id: 'hero', label: 'Index' },
  { id: 'work-grid', label: 'Work' },
  // Per-project chapters (only present on /work)
  ...projects.map((p) => ({
    id: `chapter-${p.slug}`,
    label: PROJECT_LABELS[p.slug] ?? p.client,
  })),
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Capabilities' },
  { id: 'contact', label: 'Contact' },
]

export function SectionNav() {
  const { pathname } = useLocation()
  const [present, setPresent] = useState<typeof SECTIONS>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  // Rescan the DOM whenever the route changes — pages mount different sections.
  useEffect(() => {
    // Small delay so the lazy-loaded route has time to render.
    const t = window.setTimeout(() => {
      const found = SECTIONS.filter((s) => document.getElementById(s.id))
      setPresent(found)
      if (found.length > 0) setActiveId(found[0].id)
    }, 250)
    return () => window.clearTimeout(t)
  }, [pathname])

  // Track which section is in the middle of the viewport.
  useEffect(() => {
    if (present.length === 0) return
    const observers: IntersectionObserver[] = []
    const visibility = new Map<string, number>()

    present.forEach((s) => {
      const el = document.getElementById(s.id)
      if (!el) return
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visibility.set(s.id, entry.intersectionRatio)
          })
          // Pick the section with the highest visible ratio as active.
          let top: string | null = null
          let max = 0
          visibility.forEach((ratio, id) => {
            if (ratio > max) {
              max = ratio
              top = id
            }
          })
          if (top) setActiveId(top)
        },
        {
          // Sections register as "in view" most when the middle 50% overlaps the viewport.
          rootMargin: '-25% 0px -25% 0px',
          threshold: [0, 0.25, 0.5, 0.75, 1],
        },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [present])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    // Slight offset so the nav bar at the top doesn't cover the section header.
    const y = el.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  if (present.length < 2) return null

  return (
    <nav
      aria-label="Section navigation"
      className="pointer-events-none fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 md:right-6 md:block"
    >
      {/* Frosted-glass card — soft rounded edges, layered gradient surface,
          drop shadow for depth. Reads as a floating 3D element on any bg. */}
      <div
        className="pointer-events-auto rounded-2xl border border-ink/8 bg-gradient-to-br from-paper/85 via-paper/65 to-paper/45 px-4 py-4 backdrop-blur-xl"
        style={{
          boxShadow:
            '0 18px 40px -16px rgba(14,14,14,0.28), 0 2px 6px rgba(14,14,14,0.08), inset 0 1px 0 rgba(255,255,255,0.5)',
        }}
      >
        <ul className="flex flex-col gap-3">
          {present.map((s, i) => {
            const active = s.id === activeId
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(s.id)}
                  className="group flex items-center gap-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.22em]"
                  aria-current={active ? 'true' : undefined}
                >
                  {/* Label — visible when active OR on hover */}
                  <span
                    className={`block tabular-nums transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      active
                        ? 'translate-x-0 text-ink opacity-100'
                        : 'translate-x-2 text-ink/65 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')} — {s.label}
                  </span>
                  {/* Indicator dash — long when active, short otherwise */}
                  <span
                    aria-hidden
                    className={`block h-[2px] origin-right transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      active ? 'w-10 bg-ink' : 'w-4 bg-ink/45 group-hover:w-6 group-hover:bg-ink/75'
                    }`}
                  />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
