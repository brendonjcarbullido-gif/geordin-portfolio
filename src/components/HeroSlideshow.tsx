import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useLightbox } from '@/components/Lightbox'

/**
 * HeroSlideshow — auto-cycling crossfade. All images stay mounted; the
 * active one is opacity 1, others 0, transitioned via CSS. No AnimatePresence
 * so there's no risk of stale ghost frames piling up.
 */
interface Props {
  images: string[]
  group: string
  interval?: number
  aspect?: string
  className?: string
  alt?: string
  dotsAtBottom?: boolean
}

export function HeroSlideshow({
  images,
  group,
  interval = 4500,
  aspect = '4/3',
  className = '',
  alt = 'Featured work',
  dotsAtBottom = false,
}: Props) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const { open, register } = useLightbox()

  // Register every slide with the lightbox so all are reachable via ← →
  useEffect(() => {
    const cleanups = images.map((src) => register(group, { src, alt }))
    return () => cleanups.forEach((c) => c())
  }, [images, group, alt, register])

  // Auto-advance
  useEffect(() => {
    if (reduce || interval <= 0 || images.length < 2 || paused) return
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % images.length)
    }, interval)
    return () => window.clearInterval(id)
  }, [reduce, interval, images.length, paused])

  const handleClick = () => open(group, images[active])

  return (
    <div
      className={`relative overflow-hidden bg-paper-2 ${className}`}
      style={aspect ? { aspectRatio: aspect } : undefined}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* All images stacked, crossfaded via opacity. No AnimatePresence. */}
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          loading={i === 0 ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onClick={i === active ? handleClick : undefined}
          data-cursor={i === active ? 'Expand' : undefined}
          className="absolute inset-0 h-full w-full cursor-zoom-in object-cover transition-opacity duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: i === active ? 1 : 0,
            pointerEvents: i === active ? 'auto' : 'none',
          }}
        />
      ))}

      {/* Progress dots — top by default, bottom when dotsAtBottom (mobile masthead) */}
      <div
        className={`pointer-events-auto absolute inset-x-0 z-10 flex justify-center gap-1.5 ${
          dotsAtBottom ? 'bottom-3 md:bottom-4' : 'top-3 md:top-4'
        }`}
      >
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => { e.stopPropagation(); setActive(i) }}
            aria-label={`Slide ${i + 1}`}
            className="h-1 w-6 transition-all duration-500"
            style={{
              backgroundColor: i === active ? 'rgba(246,244,239,0.95)' : 'rgba(246,244,239,0.35)',
            }}
          />
        ))}
      </div>

      {/* Caption strip — hidden when dots take the bottom slot */}
      {!dotsAtBottom && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper mix-blend-difference md:p-4">
          <span>
            Fig. {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
          <span>Click to expand ↗</span>
        </div>
      )}
    </div>
  )
}
