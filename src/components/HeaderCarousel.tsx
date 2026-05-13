import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { LightboxImage } from '@/components/Lightbox'

/**
 * HeaderCarousel — slim auto-cycling thumb strip designed to sit BEHIND a
 * page title without distracting from it. Scrolls internally (its own
 * `scrollLeft`) so advancing slides never moves the page.
 *
 * Default rendering is dimmed (opacity 0.5) so the title in front remains
 * the focal element.
 */
interface Props {
  images: string[]
  group: string
  /** ms between auto-advances. Set to 0 to disable. */
  interval?: number
  className?: string
  label?: string
  /** Render at reduced opacity (default true) so the carousel reads as background. */
  dimmed?: boolean
}

export function HeaderCarousel({
  images,
  group,
  interval = 3500,
  className = '',
  label = 'Now featuring',
  dimmed = true,
}: Props) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)

  // Auto-advance
  useEffect(() => {
    if (reduce || interval <= 0 || images.length < 2) return
    const id = window.setInterval(() => {
      if (pausedRef.current) return
      setActive((a) => (a + 1) % images.length)
    }, interval)
    return () => window.clearInterval(id)
  }, [reduce, interval, images.length])

  // Scroll the active thumb into view INSIDE the track only — never affect
  // the page scroll. Uses the track's own scrollLeft, not scrollIntoView.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const child = track.children[active] as HTMLElement | undefined
    if (!child) return
    // Compute target so the active thumb is centered in the track viewport.
    const target = child.offsetLeft - (track.clientWidth - child.clientWidth) / 2
    const clamped = Math.max(0, Math.min(target, track.scrollWidth - track.clientWidth))
    track.scrollTo({ left: clamped, behavior: reduce ? 'auto' : 'smooth' })
  }, [active, reduce])

  return (
    <div
      className={`relative ${className}`}
      style={{ opacity: dimmed ? 0.5 : 1 }}
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      {/* Label + counter */}
      <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-ink-soft">
        <span>{label}</span>
        <span>{String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
      </div>

      {/* Horizontal scrolling track — scrolls internally only */}
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain"
      >
        {images.map((src, i) => (
          <motion.button
            key={src + i}
            type="button"
            onClick={() => setActive(i)}
            className="relative shrink-0 snap-center overflow-hidden bg-paper-2"
            animate={{
              opacity: active === i ? 1 : 0.45,
              scale: active === i ? 1 : 0.96,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            aria-label={`Show image ${i + 1}`}
          >
            <LightboxImage
              src={src}
              group={group}
              alt={`Featured ${i + 1}`}
              loading="lazy"
              decoding="async"
              className="block h-[96px] w-auto max-w-none md:h-[120px]"
            />
          </motion.button>
        ))}
      </div>

      {/* Thin progress bar */}
      <div className="mt-2 flex gap-1">
        {images.map((_, i) => (
          <span
            key={i}
            className={`h-px flex-1 transition-colors duration-500 ${active === i ? 'bg-ink' : 'bg-ink/15'}`}
          />
        ))}
      </div>
    </div>
  )
}
