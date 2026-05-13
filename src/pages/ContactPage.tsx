import { motion } from 'framer-motion'
import { Contact } from '@/sections/Contact'
import { HeaderCarousel } from '@/components/HeaderCarousel'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { projects } from '@/data/projects'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * ContactPage — wraps the Contact section. Header carousel sits BEHIND
 * the title block, dimmed, as ambient context.
 */
export function ContactPage() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const carouselImages = projects.flatMap((p) => p.featured.slice(0, 1))

  return (
    <main className="relative min-h-screen bg-paper text-ink">
      {/* Top strip */}
      <div className="grid grid-cols-12 gap-x-4 border-b border-rule px-5 py-4 pt-24 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft sm:px-6 md:px-10 md:pt-28">
        <span className="col-span-6 md:col-span-3">Index — Contact</span>
        <span className="hidden md:col-span-6 md:block text-center text-ink">
          Open for VM, windows, flagships, consulting
        </span>
        <span className="col-span-6 text-right md:col-span-3">Los Angeles ↗</span>
      </div>

      <section className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24">
        {/* Desktop only — carousel layered BEHIND the title. Mobile renders
            the carousel below the title (see below). Conditional mount so
            only one HeaderCarousel instance registers with the lightbox. */}
        {isDesktop && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 px-5 sm:px-6 md:px-10">
            <div className="ml-auto w-[45%] pointer-events-auto">
              <HeaderCarousel
                images={carouselImages}
                group="contact-header"
                label="Across the practice"
                dimmed
              />
            </div>
          </div>
        )}

        <motion.div
          className="relative z-10 grid grid-cols-12 gap-x-4 gap-y-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
        >
          <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft md:col-span-3">
            Currently
          </p>
          <p className="col-span-12 max-w-[44ch] text-[clamp(1rem,1.3vw,1.25rem)] font-medium leading-[1.5] text-ink md:col-span-6">
            Open to Lead VM roles, flagship openings, freelance windows, and consulting on remodels.
          </p>

          {!isDesktop && (
            <div className="col-span-12">
              <HeaderCarousel
                images={carouselImages}
                group="contact-header"
                label="Across the practice"
              />
            </div>
          )}
        </motion.div>
      </section>

      <Contact />
    </main>
  )
}
