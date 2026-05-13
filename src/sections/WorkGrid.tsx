import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { projects, type Project } from '@/data/projects'
import { MosaicCollage } from '@/components/MosaicCollage'
import { ChapterStripMobile } from '@/components/ChapterStripMobile'
import { useMediaQuery } from '@/hooks/useMediaQuery'

/**
 * WorkGrid — three chapter spreads. Desktop renders the 4-image mosaic with
 * scroll-tracked 3D motion (MosaicCollage). Mobile renders a horizontal
 * snap-scroll strip per chapter (ChapterStripMobile). useMediaQuery picks
 * one or the other so neither component pays mount/effect cost on the
 * wrong device.
 */
export function WorkGrid({ omitHeader = false }: { omitHeader?: boolean }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  return (
    <section id="work-grid" className={`relative bg-paper text-ink ${omitHeader ? '' : ''}`}>
      {!omitHeader && (
        <header className="border-b border-rule px-5 py-8 sm:px-6 sm:py-10 md:px-10 md:py-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
            Index 002 — Selected Work
          </p>
          <h2 className="mt-6 text-display-xl font-extrabold uppercase leading-[0.86] tracking-[-0.045em] text-ink">
            Three flagships.
          </h2>
        </header>
      )}

      <ol className="relative">
        {projects.map((p, i) =>
          isDesktop ? (
            <Chapter key={p.slug} project={p} index={i} reverse={i % 2 === 1} />
          ) : (
            <ChapterStripMobile key={p.slug} project={p} index={i} />
          ),
        )}
      </ol>
    </section>
  )
}

function Chapter({ project, index, reverse }: { project: Project; index: number; reverse: boolean }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLLIElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const railY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['10%', '-10%'])

  const num = String(index + 1).padStart(3, '0')
  const total = '003'

  return (
    <li ref={ref} className="relative border-b border-rule">
      <div className="grid grid-cols-12 gap-x-4 px-5 py-14 sm:px-6 sm:py-20 md:px-10 md:py-28">
        {/* Side rail — chapter number, label, year, role, CTA */}
        <motion.aside
          className={`col-span-12 mb-6 md:col-span-3 md:mb-0 ${reverse ? 'md:order-2 md:col-start-10' : 'md:col-start-1'}`}
          style={{ y: railY }}
        >
          <div className="flex flex-col gap-5 md:sticky md:top-28">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase leading-none tracking-[0.22em] text-ink-soft md:flex-col md:items-start md:gap-3">
              <span>{num} / {total}</span>
              <span>{project.category}</span>
            </div>

            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
              {project.client}
            </p>
            <h3 className="text-[clamp(1.125rem,1.4vw,1.5rem)] font-extrabold uppercase leading-[1.05] tracking-[-0.01em] text-ink">
              {project.title}
            </h3>

            <ul className="flex flex-col gap-1.5 border-t border-rule pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
              <li><span className="text-ink-soft/60">Year</span> <span className="ml-1 text-ink">{String(project.year)}</span></li>
              <li><span className="text-ink-soft/60">Role</span> <span className="ml-1 text-ink">{project.caseStudy.role}</span></li>
              <li><span className="text-ink-soft/60">Location</span> <span className="ml-1 text-ink">Los Angeles</span></li>
            </ul>

            <Link
              to={`/work/${project.slug}`}
              className="group mt-2 inline-flex w-fit items-center gap-2 border border-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
              data-cursor="View"
            >
              Case study
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </motion.aside>

        {/* 4-image mosaic collage with 3D scroll motion */}
        <div className={`col-span-12 md:col-span-9 ${reverse ? 'md:order-1 md:col-start-1' : 'md:col-start-4'}`}>
          <MosaicCollage
            images={project.featured}
            group={project.slug}
            client={project.client}
            reverse={reverse}
          />
        </div>
      </div>
    </li>
  )
}
