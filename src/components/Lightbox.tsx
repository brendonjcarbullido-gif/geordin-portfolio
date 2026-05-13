import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { projects } from '@/data/projects'

/**
 * Lightbox — click any <LightboxImage /> to open it centered in a dark frame.
 *
 * Each expanded image is captioned at the bottom-right: project title, plate
 * number, year — derived from the image filename ({slug}-still-{n}.webp).
 */

type GalleryEntry = { src: string; alt?: string }
type GalleryMap = Record<string, GalleryEntry[]>

interface LightboxContextValue {
  register: (group: string, entry: GalleryEntry) => () => void
  open: (group: string, src: string) => void
}

const LightboxContext = createContext<LightboxContextValue | null>(null)

export function useLightbox() {
  const ctx = useContext(LightboxContext)
  if (!ctx) throw new Error('useLightbox must be used inside <LightboxProvider>')
  return ctx
}

/**
 * Derive a caption from an image URL. Filenames follow the pattern
 * `{project-slug}-still-{n}.webp`. Returns null if the slug isn't a known
 * project (e.g. assets outside the case studies).
 */
function metaFromSrc(src: string): {
  client: string
  title: string
  plate: number
  total: number
  year: string | number
  category: string
} | null {
  const file = src.split('/').pop() ?? ''
  // Match the longest prefix that resolves to a project slug. We can't use
  // the captured part alone because slugs themselves contain hyphens.
  const m = file.match(/^(.+)-still-(\d+)\.webp$/i)
  if (!m) return null
  const [, slug, plateStr] = m
  const project = projects.find((p) => p.slug === slug)
  if (!project) return null
  return {
    client: project.client,
    title: project.title,
    plate: parseInt(plateStr, 10),
    total: project.caseStudy.images.length,
    year: project.year,
    category: project.category,
  }
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const galleriesRef = useRef<GalleryMap>({})
  const [active, setActive] = useState<{ group: string; index: number } | null>(null)
  /** Touch-swipe origin for mobile gestures. Null when no active gesture. */
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const register = useCallback((group: string, entry: GalleryEntry) => {
    const list = galleriesRef.current[group] ?? (galleriesRef.current[group] = [])
    list.push(entry)
    return () => {
      const arr = galleriesRef.current[group]
      if (!arr) return
      const i = arr.findIndex((e) => e.src === entry.src)
      if (i >= 0) arr.splice(i, 1)
      if (arr.length === 0) delete galleriesRef.current[group]
    }
  }, [])

  const open = useCallback((group: string, src: string) => {
    const list = galleriesRef.current[group] ?? []
    const index = Math.max(0, list.findIndex((e) => e.src === src))
    setActive({ group, index })
  }, [])

  const close = useCallback(() => setActive(null), [])
  const step = useCallback(
    (delta: number) => {
      setActive((prev) => {
        if (!prev) return prev
        const list = galleriesRef.current[prev.group] ?? []
        if (list.length === 0) return prev
        const next = (prev.index + delta + list.length) % list.length
        return { ...prev, index: next }
      })
    },
    [],
  )

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [active, close, step])

  const value = useMemo(() => ({ register, open }), [register, open])

  const currentList = active ? galleriesRef.current[active.group] ?? [] : []
  const current = active ? currentList[active.index] : null
  const meta = current ? metaFromSrc(current.src) : null

  // Mobile-only touch gestures on the modal:
  //   swipe left / right  → step ±1
  //   swipe down ≥ 100px  → close
  // Gated to (max-width: 767px) so desktop touch screens don't intercept the
  // existing mouse/keyboard flow. Pinch (two-finger) is ignored — the image
  // declares touch-action: pinch-zoom so iOS handles native zoom natively.
  // If visualViewport is already zoomed in (scale > 1.05) we don't record
  // a start, so the user can pan the zoomed image without it being read as
  // a swipe.
  const SWIPE_X_MIN = 50
  const SWIPE_Y_CLOSE = 100
  const onModalTouchStart = (e: React.TouchEvent) => {
    if (!window.matchMedia('(max-width: 767px)').matches) return
    if (e.touches.length !== 1) {
      // Pinch (or unknown multi-finger) — clear any stale start and bail.
      touchStartRef.current = null
      return
    }
    if (window.visualViewport && window.visualViewport.scale > 1.05) {
      touchStartRef.current = null
      return
    }
    const t = e.touches[0]
    touchStartRef.current = { x: t.clientX, y: t.clientY }
  }
  const onModalTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current
    // Always clear at the top — next gesture starts from a fresh slate
    // regardless of which branch we take below.
    touchStartRef.current = null
    if (!start) return
    if (window.visualViewport && window.visualViewport.scale > 1.05) return
    const t = e.changedTouches[0]
    if (!t) return
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)
    // Vertical-down close beats a slightly-angled horizontal swipe.
    if (dy > SWIPE_Y_CLOSE && dy > absX) {
      close()
      return
    }
    if (absX > absY && absX > SWIPE_X_MIN) {
      step(dx < 0 ? 1 : -1)
    }
  }

  return (
    <LightboxContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {active && current && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-[100] flex flex-col bg-ink/96 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={close}
            onTouchStart={onModalTouchStart}
            onTouchEnd={onModalTouchEnd}
            style={{ touchAction: 'pan-y' }}
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
          >
            {/* Top strip — counter + close */}
            <div className="flex items-center justify-between px-5 py-5 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/75 sm:px-6 md:px-10">
              <span>
                {String(active.index + 1).padStart(2, '0')} / {String(currentList.length).padStart(2, '0')}
                {currentList.length > 1 && ' · ← → to navigate'}
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); close() }}
                className="text-paper transition-colors hover:text-signal-soft"
                aria-label="Close"
              >
                Close ✕
              </button>
            </div>

            {/* Frame — centered. The image and its caption share one wrapper
                so the caption sits at the bottom-right of the IMAGE itself,
                with a gradient over the image for legibility. */}
            <div className="relative flex flex-1 items-center justify-center p-4 sm:p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.src}
                  className="relative inline-block max-h-full"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={current.src}
                    alt={current.alt ?? ''}
                    draggable={false}
                    style={{
                      width: 'auto',
                      height: 'auto',
                      maxWidth: 'min(100%, 1600px)',
                      maxHeight: 'min(78vh, 1200px)',
                      objectFit: 'contain',
                      display: 'block',
                      // Browser-native pinch-zoom on iOS (no JS library);
                      // single-finger touches pass through to the modal's
                      // touch handlers for swipe nav / swipe-down close.
                      touchAction: 'pinch-zoom',
                    }}
                  />
                  {/* Caption strip on the image — gradient for legibility */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-end bg-gradient-to-t from-ink/85 via-ink/40 to-transparent px-5 pb-5 pt-20 md:px-7 md:pb-6 md:pt-24">
                    {meta ? (
                      <div className="text-right">
                        <p className="font-extrabold uppercase leading-[1.05] tracking-[-0.01em] text-paper text-[clamp(0.9375rem,1.2vw,1.25rem)]">
                          {meta.client}
                        </p>
                        <p className="mt-1 text-[clamp(0.8125rem,1vw,1rem)] font-medium text-paper/85">
                          {meta.title}
                        </p>
                        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/65">
                          {meta.category} · {String(meta.year)}
                        </p>
                      </div>
                    ) : (
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/70">
                        {current.alt || 'Untitled'}
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {currentList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); step(-1) }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 border border-paper/20 px-3 py-3 font-mono text-[12px] uppercase tracking-[0.22em] text-paper/70 transition-colors hover:border-paper hover:text-paper sm:left-6"
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); step(1) }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 border border-paper/20 px-3 py-3 font-mono text-[12px] uppercase tracking-[0.22em] text-paper/70 transition-colors hover:border-paper hover:text-paper sm:right-6"
                    aria-label="Next image"
                  >
                    →
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  )
}

interface LightboxImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onClick'> {
  src: string
  group: string
  alt?: string
  onClick?: React.MouseEventHandler<HTMLImageElement>
}

export function LightboxImage({ src, group, alt, className, onClick, ...rest }: LightboxImageProps) {
  const { register, open } = useLightbox()

  useEffect(() => {
    return register(group, { src, alt })
  }, [register, group, src, alt])

  return (
    <img
      {...rest}
      src={src}
      alt={alt ?? ''}
      className={`cursor-zoom-in transition-[opacity,filter] duration-500 hover:opacity-90 ${className ?? ''}`}
      data-cursor="Expand"
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        open(group, src)
      }}
      draggable={false}
    />
  )
}
