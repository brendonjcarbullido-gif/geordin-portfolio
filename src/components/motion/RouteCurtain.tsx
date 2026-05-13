import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { preloadAssets } from '@/hooks/useMediaPreload'
import { getPageAssets } from '@/lib/preloadAssets'
import { projects } from '@/data/projects'

const ease = [0.77, 0, 0.175, 1] as const

const ROUTE_LABEL: Record<string, string> = {
  '/': 'Index',
  '/work': 'Selected Work',
  '/about': 'About',
  '/contact': 'Contact',
}

type CurtainMeta = {
  label: string
  subLabel?: string
}

function getCurtainMeta(pathname: string): CurtainMeta {
  if (pathname.startsWith('/work/')) {
    const slug = pathname.slice('/work/'.length)
    const project = projects.find((p) => p.slug === slug)
    if (project) {
      return { label: project.client, subLabel: project.category }
    }
  }
  return { label: ROUTE_LABEL[pathname] ?? 'Geordin' }
}

const MIN_COVER_MS = 600
const MAX_WAIT_MS = 7000

/**
 * RouteCurtain — black panel wipe on route change. Bold uppercase route label,
 * mono sub-label, single hairline. Matches the IntroLoader visual language.
 */
export function RouteCurtain() {
  const prefersReduced = useReducedMotion()
  const { pathname } = useLocation()
  const firstRender = useRef(true)
  const [phase, setPhase] = useState<'idle' | 'covering' | 'uncovering'>('idle')
  const [meta, setMeta] = useState<CurtainMeta>({ label: 'Index' })

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (prefersReduced) return

    setMeta(getCurtainMeta(pathname))
    setPhase('covering')

    const assets = getPageAssets(pathname)
    const coverStart = Date.now()
    let cancelled = false

    Promise.race([
      preloadAssets(assets),
      new Promise<void>((r) => setTimeout(r, MAX_WAIT_MS)),
    ]).then(() => {
      if (cancelled) return
      const elapsed = Date.now() - coverStart
      const remaining = Math.max(0, MIN_COVER_MS - elapsed)
      setTimeout(() => {
        if (cancelled) return
        setPhase('uncovering')
        setTimeout(() => {
          if (cancelled) return
          setPhase('idle')
        }, 800)
      }, remaining)
    })

    return () => {
      cancelled = true
    }
  }, [pathname, prefersReduced])

  if (prefersReduced) return null

  return (
    <AnimatePresence>
      {phase !== 'idle' && (
        <motion.div
          key="curtain"
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[70] flex flex-col justify-between bg-ink text-paper"
          initial={{ y: '-101%' }}
          animate={{ y: phase === 'uncovering' ? '-101%' : 0 }}
          exit={{ y: '-101%' }}
          transition={{ duration: 0.8, ease }}
        >
          <div className="flex items-center justify-between px-5 py-6 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/65 sm:px-6 md:px-10">
            <span>Geordin Zolliecoffer</span>
            <span>{meta.subLabel ?? '—'}</span>
          </div>

          <motion.div
            className="px-5 sm:px-6 md:px-10"
            initial={{ y: 16, opacity: 0 }}
            animate={{
              y: phase === 'covering' ? 0 : -8,
              opacity: phase === 'covering' ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease, delay: phase === 'covering' ? 0.18 : 0 }}
          >
            <p className="text-[clamp(2.75rem,11vw,9rem)] font-extrabold uppercase leading-[0.88] tracking-[-0.04em]">
              {meta.label}
            </p>
          </motion.div>

          <div className="flex items-center justify-between px-5 py-6 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/65 sm:px-6 md:px-10">
            <span>Loading</span>
            <span>Vol. 01 · 2026</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
