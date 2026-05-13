import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { projects } from '@/data/projects'

/**
 * MobileProgress — fixed thin progress bar at the top of the mobile viewport.
 * Sibling of SectionNav (which is desktop-only). Reads the same DOM section
 * ids and shows the active section's label centered, with a fill that tracks
 * page scroll progress. Hidden at md+.
 */

const PROJECT_LABELS: Record<string, string> = {
  'kith-west-hollywood': 'Kith W.H.',
  'kith-sunset': 'Kith Sunset',
  'nordstrom-thousand-oaks': 'Nordstrom',
}

const SECTIONS: Array<{ id: string; label: string }> = [
  { id: 'hero', label: 'Index' },
  { id: 'work-grid', label: 'Work' },
  ...projects.map((p) => ({
    id: `chapter-${p.slug}`,
    label: PROJECT_LABELS[p.slug] ?? p.client,
  })),
  { id: 'about', label: 'About' },
  { id: 'expertise', label: 'Capabilities' },
  { id: 'contact', label: 'Contact' },
]

export function MobileProgress() {
  const { pathname } = useLocation()
  const [present, setPresent] = useState<typeof SECTIONS>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const t = window.setTimeout(() => {
      const found = SECTIONS.filter((s) => document.getElementById(s.id))
      setPresent(found)
      if (found.length > 0) setActiveId(found[0].id)
    }, 250)
    return () => window.clearTimeout(t)
  }, [pathname])

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
        { rootMargin: '-25% 0px -25% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [present])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

  if (present.length < 2) return null

  const active = present.find((s) => s.id === activeId) ?? present[0]
  const index = present.findIndex((s) => s.id === active.id)

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-30 flex h-9 items-center justify-center bg-paper/95 backdrop-blur-sm md:hidden"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-rule" />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 bg-ink/8 transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
      <span className="relative z-10 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/80">
        {String(index + 1).padStart(2, '0')} — {active.label}
      </span>
    </div>
  )
}
