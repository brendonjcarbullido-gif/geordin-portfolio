import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { LightboxImage } from '@/components/Lightbox'
import type { Project } from '@/data/projects'

/**
 * ChapterStripMobile — mobile counterpart to MosaicCollage. One chapter per
 * project, rendered as: index/title strip → horizontal snap-scroll of the
 * four featured plates with edge peek → caption row → "Case study →" tap
 * target. No scroll-driven 3D parallax — a subtle whileInView spring on
 * each plate is plenty on a touch device. Desktop is rendered by the
 * untouched MosaicCollage path in WorkGrid.
 */
interface Props {
  project: Project
  index: number
}

export function ChapterStripMobile({ project, index }: Props) {
  const reduce = useReducedMotion()
  const num = String(index + 1).padStart(3, '0')
  const total = '003'

  return (
    <li
      id={`chapter-${project.slug}`}
      className="relative border-b border-rule"
    >
      {/* Chapter index strip — sticky just below fixed chrome so the title
          stays anchored while users swipe the gallery. */}
      <div className="sticky top-[5.25rem] z-10 bg-paper/95 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-rule px-5 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
          <span>{num} / {total}</span>
          <span>{project.category}</span>
        </div>
      </div>

      <div className="px-5 pb-10 pt-7 sm:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
          {project.client}
        </p>
        <h3 className="mt-3 text-[clamp(1.5rem,7vw,2.5rem)] font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-ink">
          {project.title}
        </h3>
      </div>

      {/* Horizontal snap-scroll gallery. Each plate ~85vw with edge peek so
          users discover the swipe. snap-mandatory + snap-center for the
          stop. -mx negates parent px so the strip is full-bleed. */}
      <div
        className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:px-6"
        style={{
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollPaddingLeft: '1.25rem',
        }}
      >
        {project.featured.map((src, i) => (
          <motion.div
            key={src}
            className="snap-center shrink-0"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: reduce ? 0.18 : 0.55,
              ease: [0.16, 1, 0.3, 1],
              delay: reduce ? 0 : i * 0.04,
            }}
          >
            <div className="h-[55vh] w-[85vw] overflow-hidden bg-paper-2">
              <LightboxImage
                src={src}
                group={project.slug}
                alt={`${project.client} — plate ${String(i + 1).padStart(2, '0')}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Caption + metadata row */}
      <div className="flex items-baseline justify-between border-t border-rule px-5 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft sm:px-6">
        <span>{project.caseStudy.role}</span>
        <span>{String(project.year)}</span>
      </div>

      {/* Full-width case-study tap target — 44px+ height */}
      <Link
        to={`/work/${project.slug}`}
        className="flex min-h-[3rem] items-center justify-between gap-3 border-t border-rule px-5 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink transition-colors duration-300 active:bg-ink/5 sm:px-6"
      >
        <span>View case study</span>
        <span aria-hidden>→</span>
      </Link>
    </li>
  )
}
