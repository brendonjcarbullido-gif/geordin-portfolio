import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useMediaPreload } from '@/hooks/useMediaPreload'
import { PRELOAD_ASSETS, getPageAssets } from '@/lib/preloadAssets'

const SESSION_KEY = 'gz-intro-seen'
const MIN_DISPLAY_MS = 900
const MAX_WAIT_MS = 8000

/**
 * IntroLoader — first-visit black curtain. Mono counter, bold wordmark, single
 * hairline progress bar. Lifts as one panel (no two-half split).
 */
export function IntroLoader() {
  const prefersReduced = useReducedMotion()
  const [done, setDone] = useState(() => {
    if (typeof window === 'undefined') return true
    return sessionStorage.getItem(SESSION_KEY) === '1'
  })
  const [pct, setPct] = useState(0)
  const [lifting, setLifting] = useState(false)

  const assets = done
    ? []
    : [...PRELOAD_ASSETS, ...getPageAssets(window.location.pathname)]
  const { progress } = useMediaPreload(assets)

  const progressRef = useRef(0)
  useEffect(() => { progressRef.current = progress }, [progress])

  useEffect(() => {
    if (done) return
    if (prefersReduced) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setDone(true)
      return
    }

    document.body.style.overflow = 'hidden'

    const start = performance.now()
    let displayPct = 0
    let raf = 0
    let lifted = false

    const tick = (now: number) => {
      const elapsed = now - start
      const realTarget = elapsed >= MAX_WAIT_MS ? 100 : progressRef.current * 100
      const diff = realTarget - displayPct
      const step = Math.max(0.22, diff * 0.06)
      displayPct = Math.min(realTarget, displayPct + step)
      setPct(Math.round(displayPct))

      if (displayPct >= 99.5 && elapsed >= MIN_DISPLAY_MS && !lifted) {
        lifted = true
        setLifting(true)
        setTimeout(() => {
          sessionStorage.setItem(SESSION_KEY, '1')
          setDone(true)
          document.body.style.overflow = ''
        }, 900)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
    }
  }, [done, prefersReduced])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[90] bg-ink text-paper"
          initial={{ y: 0 }}
          animate={{ y: lifting ? '-101%' : 0 }}
          exit={{ y: '-101%' }}
          transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
        >
          <div className="flex h-full flex-col justify-between px-5 py-8 sm:px-6 md:px-10 md:py-10">
            {/* Top strip — site mark + year */}
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-paper/70">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-soft" aria-hidden />
                Geordin Zolliecoffer
              </span>
              <span>Vol. 01 · 2026</span>
            </div>

            {/* Center — wordmark */}
            <div className="flex flex-col items-start gap-6">
              <motion.h1
                className="text-[clamp(2rem,12vw,12rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.04em]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                Visual
                <br />
                <span className="text-paper/60">Merchandising</span>
              </motion.h1>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/70">
                Thirteen years · Los Angeles · Kith · Nordstrom
              </p>
            </div>

            {/* Bottom — progress */}
            <div className="flex items-center gap-6">
              <span className="min-w-[3ch] font-mono text-[10px] uppercase tracking-[0.22em] tabular-nums text-paper/70">
                {String(pct).padStart(3, '0')}
              </span>
              <div className="relative h-px flex-1 bg-paper/15">
                <motion.div
                  className="absolute inset-y-0 left-0 origin-left bg-paper"
                  style={{ width: '100%', scaleX: pct / 100, transition: 'transform 100ms linear' }}
                />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/70">Loading</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
