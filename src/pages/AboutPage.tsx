import { About } from '@/sections/About'
import { Expertise } from '@/sections/Expertise'
import { HeaderCarousel } from '@/components/HeaderCarousel'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { resume } from '@/data/resume'
import { projects } from '@/data/projects'
import { motion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * AboutPage — biography route. Title is the focal point; a dimmed
 * carousel sits BEHIND it as ambient context.
 */
export function AboutPage() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const { identity, summary, education } = resume
  const carouselImages = projects.flatMap((p) => p.featured.slice(0, 2))

  return (
    <main className="relative min-h-screen bg-paper text-ink">
      {/* Top metadata strip */}
      <div className="grid grid-cols-12 gap-x-4 border-b border-rule px-5 py-4 pt-24 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft sm:px-6 md:px-10 md:pt-28">
        <span className="col-span-6 md:col-span-3">Index — About</span>
        <span className="hidden md:col-span-6 md:block text-center text-ink">
          Kith · Nordstrom · Los Angeles
        </span>
        <span className="col-span-6 text-right md:col-span-3">FIDM · 2013 — 2015</span>
      </div>

      {/* Hero band — name as focal. Desktop layers a dimmed carousel BEHIND
          the name; mobile renders the carousel below the name. Only one
          HeaderCarousel mounts (single source of truth for the
          `about-header` group — no duplicate lightbox entries from
          CSS-hiding the wrong viewport's mount). */}
      <section className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-20 md:px-10 md:py-28">
        {isDesktop && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 px-5 sm:px-6 md:px-10">
            <div className="ml-auto w-[55%] pointer-events-auto">
              <HeaderCarousel
                images={carouselImages}
                group="about-header"
                label="From the floor"
                dimmed
              />
            </div>
          </div>
        )}

        <div className="relative z-10 grid grid-cols-12 gap-x-4 gap-y-10">
          <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
            {identity.roles.join(' · ')}
          </p>
          <motion.h1
            className="col-span-12 mt-6 text-display-lg font-extrabold uppercase leading-[0.86] tracking-[-0.035em] text-ink md:mt-0"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
          >
            <span className="block">Geordin</span>
            <span className="block text-signal">Zolliecoffer.</span>
          </motion.h1>

          <motion.p
            className="col-span-12 mt-6 max-w-[58ch] text-[clamp(1.0625rem,1.4vw,1.45rem)] font-medium leading-[1.55] text-ink md:col-span-9 md:col-start-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.25 }}
          >
            {summary}
          </motion.p>

          {!isDesktop && (
            <div className="col-span-12">
              <HeaderCarousel
                images={carouselImages}
                group="about-header"
                label="From the floor"
              />
            </div>
          )}
        </div>
      </section>

      <About />

      {/* Education */}
      <section className="border-t border-rule px-5 py-20 text-ink sm:px-6 sm:py-28 md:px-10 md:py-36">
        <div className="mx-auto grid max-w-[120rem] grid-cols-12 gap-x-4 gap-y-10">
          <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft md:col-span-3">
            Education
          </p>
          <div className="col-span-12 md:col-span-9">
            <h3 className="text-[clamp(1.5rem,2.4vw,2.25rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.025em] text-ink">
              {education.school}
            </h3>
            <p className="mt-3 text-[14px] font-medium text-ink-soft md:text-[15px]">
              {education.degree} · {education.focus} · {education.emphasis}
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
              {education.years}
            </p>
          </div>
        </div>
      </section>

      <Expertise />
    </main>
  )
}
