import { motion } from 'framer-motion'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { projects } from '@/data/projects'
import { LightboxImage } from '@/components/Lightbox'
import { GalleryStripMobile } from '@/components/GalleryStripMobile'
import { useMediaQuery } from '@/hooks/useMediaQuery'

/**
 * CaseStudy — image-first editorial. Hero, headline, two-column metadata,
 * overview + deliverables, masonry plate gallery. Every image renders at
 * native ratio (no forced aspect crops, no letterbox), click to expand.
 */
export function CaseStudy() {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()

  const isDesktop = useMediaQuery('(min-width: 768px)')
  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const project = currentIndex >= 0 ? projects[currentIndex] : null
  const nextProject = currentIndex >= 0 ? projects[(currentIndex + 1) % projects.length] : null
  const num = currentIndex >= 0 ? String(currentIndex + 1).padStart(3, '0') : '000'

  if (!project) {
    return (
      <main className="grid min-h-screen place-items-center bg-paper text-ink">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="border border-ink/30 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink"
        >
          Project not found — Back home
        </button>
      </main>
    )
  }

  return (
    <main className="relative bg-paper text-ink">
      {/* Top metadata strip */}
      <div className="grid grid-cols-12 gap-x-4 border-b border-rule px-5 py-4 pt-24 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft sm:px-6 md:px-10 md:pt-28">
        <Link to="/work" className="col-span-6 text-ink hover:text-signal md:col-span-3">
          ← Work Index
        </Link>
        <span className="hidden md:col-span-6 md:block text-center">{project.client}</span>
        <span className="col-span-6 text-right md:col-span-3">
          {num} / 003 · {project.year}
        </span>
      </div>

      {/* Hero — desktop renders the image at native ratio with the title
          in a separate caption strip below. Mobile renders the image at
          h-[70vh] with the title and category overlaid at the bottom
          (gradient + text-shadow for legibility over varied lead images),
          followed by a 2-col metadata strip with hairline rules. */}
      {isDesktop ? (
        <>
          <motion.section
            className="relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {project.image && (
              <LightboxImage
                src={project.image}
                group={project.slug}
                alt={project.title}
                loading="eager"
                decoding="async"
                {...{ fetchpriority: 'high' }}
                className="block h-auto w-full"
              />
            )}
          </motion.section>

          <section className="border-b border-rule px-5 py-8 sm:px-6 md:px-10 md:py-10">
            <div className="grid grid-cols-12 gap-x-4">
              <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft md:col-span-3">
                {project.category}
              </p>
              <h1 className="col-span-12 mt-3 text-[clamp(2.25rem,6.5vw,6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.035em] text-ink md:col-span-9 md:mt-0">
                {project.title}
              </h1>
            </div>
          </section>
        </>
      ) : (
        <>
          <motion.section
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {project.image && (
              <div className="relative overflow-hidden">
                <LightboxImage
                  src={project.image}
                  group={project.slug}
                  alt={project.title}
                  loading="eager"
                  decoding="async"
                  {...{ fetchpriority: 'high' }}
                  className="block h-[70vh] w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-ink/90 via-ink/55 to-transparent px-5 pb-10 pt-32 sm:px-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/85">
                    {project.category}
                  </p>
                  <h1
                    className="text-[clamp(2rem,8vw,3.25rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-paper"
                    style={{ textShadow: '0 2px 16px rgba(14,14,14,0.55)' }}
                  >
                    {project.title}
                  </h1>
                </div>
              </div>
            )}
          </motion.section>

          {/* Mobile-only metadata strip — 2-col with hairline rules between
              cells. Brief's order: Client / Role / Year / Category. */}
          <div className="grid grid-cols-2 border-b border-rule">
            <div className="border-b border-r border-rule px-5 py-5 sm:px-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">Client</p>
              <p className="mt-2 text-[14px] font-medium text-ink">{project.client}</p>
            </div>
            <div className="border-b border-rule px-5 py-5 sm:px-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">Role</p>
              <p className="mt-2 text-[14px] font-medium text-ink">{project.caseStudy.role}</p>
            </div>
            <div className="border-r border-rule px-5 py-5 sm:px-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">Year</p>
              <p className="mt-2 text-[14px] font-medium text-ink">{String(project.year)}</p>
            </div>
            <div className="px-5 py-5 sm:px-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">Category</p>
              <p className="mt-2 text-[14px] font-medium text-ink">{project.category}</p>
            </div>
          </div>
        </>
      )}

      {/* Headline + metadata */}
      <section className="border-b border-rule px-5 py-16 sm:px-6 sm:py-20 md:px-10 md:py-28">
        <div className="grid grid-cols-12 gap-x-4 gap-y-10">
          <h2 className="col-span-12 text-display-md font-extrabold uppercase leading-[0.94] tracking-[-0.025em] text-ink md:col-span-9">
            {project.caseStudy.headline}
          </h2>
          {/* Desktop only — mobile sees the metadata strip above (below the hero). */}
          <div className="col-span-12 hidden gap-y-6 border-t border-rule pt-8 font-mono text-[11px] uppercase tracking-[0.18em] md:grid md:grid-cols-4 md:gap-x-4">
            <div>
              <p className="text-ink-soft">Role</p>
              <p className="mt-2 text-ink">{project.caseStudy.role}</p>
            </div>
            <div>
              <p className="text-ink-soft">Client</p>
              <p className="mt-2 text-ink">{project.client}</p>
            </div>
            <div>
              <p className="text-ink-soft">Year</p>
              <p className="mt-2 text-ink">{String(project.year)}</p>
            </div>
            <div>
              <p className="text-ink-soft">Location</p>
              <p className="mt-2 text-ink">Los Angeles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview + Deliverables + Results */}
      <section className="border-b border-rule px-5 py-16 sm:px-6 sm:py-20 md:px-10 md:py-28">
        <div className="grid grid-cols-12 gap-x-4 gap-y-12">
          <div className="col-span-12 md:col-span-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
              Overview
            </p>
            <p className="mt-6 max-w-[58ch] text-[clamp(0.9375rem,1.2vw,1.15rem)] font-medium leading-[1.6] text-ink">
              {project.caseStudy.overview}
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
              Deliverables
            </p>
            <ul className="mt-6 flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink">
              {project.caseStudy.deliverables.map((d, i) => (
                <li key={d} className="flex items-baseline gap-3">
                  {/* Mobile: leading "01 / 02 / …" mono number. Flex
                      items-baseline so wrapped lines align past the number
                      rather than under it. */}
                  <span className="w-7 flex-shrink-0 text-[10px] tracking-[0.22em] text-ink-soft md:hidden">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* Desktop: original short horizontal dash. */}
                  <span className="hidden h-px w-3 flex-shrink-0 self-start bg-ink-soft md:mt-[0.5em] md:inline-block" aria-hidden />
                  <span className="flex-1">{d}</span>
                </li>
              ))}
            </ul>

            {project.caseStudy.results && project.caseStudy.results.length > 0 && (
              <>
                <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                  Results
                </p>
                <ul className="mt-6 flex flex-col gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink">
                  {project.caseStudy.results.map((r, i) => (
                    <li key={r} className="flex items-baseline gap-3">
                      <span className="w-7 flex-shrink-0 text-[10px] tracking-[0.22em] text-signal md:hidden">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="hidden h-px w-3 flex-shrink-0 self-start bg-signal md:mt-[0.5em] md:inline-block" aria-hidden />
                      <span className="flex-1">{r}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Gallery — masonry via CSS columns. Native ratios preserved. */}
      <section className="border-b border-rule px-5 py-16 sm:px-6 sm:py-20 md:px-10 md:py-28">
        <div className="grid grid-cols-12 gap-x-4">
          <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft md:col-span-3">
            Plates
          </p>
          <p className="col-span-12 mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink md:col-span-9 md:mt-0">
            {String(project.caseStudy.images.length).padStart(2, '0')} stills · click any image to expand · ← → to navigate
          </p>
        </div>
        {/* Mobile: justified-row gallery using build-time dimensions.
            Desktop: original column-masonry, untouched. */}
        {isDesktop ? (
          <div className="mt-10 columns-1 gap-3 sm:columns-2 md:columns-3 [&>figure]:mb-3">
            {project.caseStudy.images.map((img, i) => (
              <motion.figure
                key={`${img}-${i}`}
                className="group relative break-inside-avoid overflow-hidden"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.02 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <LightboxImage
                  src={img}
                  group={project.slug}
                  alt={`${project.title} plate ${i + 1}`}
                  loading={i < 4 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.015]"
                />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-end bg-gradient-to-t from-ink/55 to-transparent p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-paper">
                    Expand ↗
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <GalleryStripMobile images={project.caseStudy.images} group={project.slug} />
          </div>
        )}
      </section>

      {/* Next project — desktop: dramatic ink-inverse full section.
          Mobile: full-width hairline-bordered cream tap target with arrow. */}
      {nextProject && (
        isDesktop ? (
          <Link
            to={`/work/${nextProject.slug}`}
            data-cursor="Next"
            className="group block bg-ink text-paper transition-colors"
          >
            <div className="grid grid-cols-12 gap-x-4 px-5 py-16 sm:px-6 sm:py-20 md:px-10 md:py-28">
              <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/65 md:col-span-3">
                Next ↗
              </p>
              <p className="col-span-12 mt-2 text-[clamp(2rem,7vw,6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.035em] text-paper transition-transform duration-700 group-hover:translate-x-2 md:col-span-9 md:mt-0">
                {nextProject.title}
              </p>
              <p className="col-span-12 mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/65 md:col-span-9 md:col-start-4">
                {nextProject.client} · {String(nextProject.year)}
              </p>
            </div>
          </Link>
        ) : (
          <Link
            to={`/work/${nextProject.slug}`}
            className="flex min-h-[3rem] items-center justify-between gap-4 border-y border-rule px-5 py-7 transition-colors active:bg-ink/5 sm:px-6"
          >
            <div className="flex-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                Next →
              </p>
              <p className="mt-2 text-[clamp(1.5rem,6vw,2.25rem)] font-extrabold uppercase leading-[0.96] tracking-[-0.03em] text-ink">
                {nextProject.title}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                {nextProject.client} · {String(nextProject.year)}
              </p>
            </div>
            <span aria-hidden className="font-mono text-[18px] text-ink">→</span>
          </Link>
        )
      )}
    </main>
  )
}
