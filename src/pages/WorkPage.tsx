import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projects, type Project } from '@/data/projects'
import { HeaderCarousel } from '@/components/HeaderCarousel'
import { LightboxImage } from '@/components/Lightbox'
import { GalleryStripMobile } from '@/components/GalleryStripMobile'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { resume } from '@/data/resume'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * WorkPage — full archive. Header with carousel above the title, then every
 * project rendered as its own chapter with the COMPLETE set of its case-study
 * images (not just the homepage's 4-image curated highlight). Each gallery
 * is a CSS-columns masonry — natural aspect ratios preserved.
 */
export function WorkPage() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const clientLine = resume.clients.join(' · ')
  const carouselImages = projects.flatMap((p) => p.featured.slice(0, 2))

  return (
    <main className="relative min-h-screen bg-paper text-ink">
      {/* Top strip */}
      <div className="grid grid-cols-12 gap-x-4 border-b border-rule px-5 py-4 pt-24 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft sm:px-6 md:px-10 md:pt-28">
        <span className="col-span-6 md:col-span-3">Index 002 — Selected Work</span>
        <span className="hidden md:col-span-6 md:block text-center text-ink">{clientLine}</span>
        <span className="col-span-6 text-right md:col-span-3">003 chapters · {totalPlates()} plates</span>
      </div>

      {/* Hero — title in front. Desktop layers a dimmed carousel BEHIND the
          title; mobile renders the carousel below the text. Conditional
          mount so only one HeaderCarousel instance registers with the
          `work-header` lightbox group (project galleries below use the
          per-project slug as their group, so they remain isolated). */}
      <section className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-20 md:px-10 md:py-28">
        {isDesktop && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 px-5 sm:px-6 md:px-10">
            <div className="ml-auto w-[55%] pointer-events-auto">
              <HeaderCarousel
                images={carouselImages}
                group="work-header"
                label="Across the practice"
                dimmed
              />
            </div>
          </div>
        )}

        <div className="relative z-10 grid grid-cols-12 gap-x-4 gap-y-10">
          <motion.h1
            className="col-span-12 text-display-xl font-extrabold uppercase leading-[0.86] tracking-[-0.04em] text-ink"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
          >
            Windows.
            <br />
            <span className="text-signal">Floorsets.</span>
            <br />
            Openings.
          </motion.h1>

          <motion.p
            className="col-span-12 max-w-[58ch] text-[clamp(0.9375rem,1.2vw,1.15rem)] font-medium leading-[1.5] text-ink-soft md:col-span-7"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.25 }}
          >
            Three case studies across {clientLine}. {totalPlates()} plates total, built on the floor, on deadline, to standard.
          </motion.p>

          {!isDesktop && (
            <div className="col-span-12">
              <HeaderCarousel
                images={carouselImages}
                group="work-header"
                label="Across the practice"
              />
            </div>
          )}
        </div>
      </section>

      {/* Full archive — every plate from every project */}
      <ol className="relative">
        {projects.map((p, i) => (
          <ChapterFull key={p.slug} project={p} index={i} />
        ))}
      </ol>
    </main>
  )
}

function GallerySection({ project }: { project: Project }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (!isDesktop) {
    return (
      <div className="px-5 pb-16 sm:px-6 sm:pb-24">
        <GalleryStripMobile images={project.caseStudy.images} group={project.slug} />
      </div>
    )
  }

  return (
    <div className="px-5 pb-16 sm:px-6 sm:pb-24 md:px-10 md:pb-28">
      <div className="columns-1 gap-3 sm:columns-2 md:columns-3 [&>figure]:mb-3">
        {project.caseStudy.images.map((img, i) => (
          <motion.figure
            key={img}
            className="group relative break-inside-avoid overflow-hidden bg-paper-2"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.02 }}
            transition={{ duration: 0.6, ease, delay: Math.min(i * 0.02, 0.4) }}
          >
            <LightboxImage
              src={img}
              group={project.slug}
              alt={`${project.client} — plate ${i + 1}`}
              loading={i < 6 ? 'eager' : 'lazy'}
              decoding="async"
              className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.015]"
            />
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-end bg-gradient-to-t from-ink/55 to-transparent p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-paper">
                Expand ↗
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  )
}

function totalPlates() {
  return projects.reduce((sum, p) => sum + p.caseStudy.images.length, 0)
}

function ChapterFull({ project, index }: { project: Project; index: number }) {
  const num = String(index + 1).padStart(3, '0')
  const total = '003'

  return (
    <li id={`chapter-${project.slug}`} className="relative border-t border-rule">
      {/* Chapter header — title, year, role, case-study link */}
      <header className="px-5 py-12 sm:px-6 sm:py-16 md:px-10 md:py-20">
        <div className="grid grid-cols-12 gap-x-4 gap-y-6">
          <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft md:col-span-3">
            {num} / {total} · {project.category}
          </p>
          <div className="col-span-12 md:col-span-9">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
              {project.client}
            </p>
            <h2 className="mt-2 text-[clamp(2rem,5vw,4.5rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-ink">
              {project.title}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft md:grid-cols-4">
              <span><span className="text-ink-soft/60">Year</span> <span className="ml-1 text-ink">{String(project.year)}</span></span>
              <span><span className="text-ink-soft/60">Role</span> <span className="ml-1 text-ink">{project.caseStudy.role}</span></span>
              <span><span className="text-ink-soft/60">Location</span> <span className="ml-1 text-ink">Los Angeles</span></span>
              <span><span className="text-ink-soft/60">Plates</span> <span className="ml-1 text-ink">{String(project.caseStudy.images.length).padStart(2, '0')}</span></span>
            </div>
            <Link
              to={`/work/${project.slug}`}
              data-cursor="View"
              className="group mt-8 inline-flex w-fit items-center gap-2 border border-ink px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
            >
              Read full case study
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Gallery — mobile: justified rows; desktop: column-masonry */}
      <GallerySection project={project} />
    </li>
  )
}
