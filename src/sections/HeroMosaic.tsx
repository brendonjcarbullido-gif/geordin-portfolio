import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { image } from '@/lib/media'
import { HeroSlideshow } from '@/components/HeroSlideshow'
import { projects } from '@/data/projects'

/**
 * Masthead — name-focal magazine cover.
 *
 * Geordin's name is THE focal element: an oversized two-line wordmark that
 * spans the full viewport width. The hero image is integrated into the
 * upper-right of the same composition — the name extends across it, so the
 * image reads as part of the masthead rather than a separate banner.
 */
export function HeroMosaic() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '12%'])
  const nameY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '-4%'])

  // Slideshow pulls the lead featured still from each project, plus extras
  // for variety — cycles through 6 across all three case studies.
  const slideshowImages = [
    image('work/kith-west-hollywood-still-5.webp'),
    image('work/kith-sunset-still-2.webp'),
    image('work/nordstrom-thousand-oaks-still-1.webp'),
    image('work/kith-west-hollywood-still-13.webp'),
    image('work/kith-sunset-still-9.webp'),
    image('work/nordstrom-thousand-oaks-still-10.webp'),
  ]
  // Avoid the unused-import warning while the slug list is here for context.
  void projects

  return (
    <section
      ref={ref}
      id="hero"
      className="relative bg-paper text-ink"
    >
      {/* Top metadata strip */}
      <div className="grid grid-cols-12 gap-x-4 border-b border-rule px-5 py-4 font-mono text-[10px] uppercase leading-none tracking-[0.22em] text-ink sm:px-6 md:px-10">
        <span className="col-span-6 md:col-span-3">GZ — Vol. 01</span>
        <span className="hidden md:col-span-3 md:block text-ink-soft">Lead Visual Merchandiser</span>
        <span className="hidden md:col-span-3 md:block text-ink-soft">Los Angeles, CA</span>
        <span className="col-span-6 text-right md:col-span-3">2016 → 2026</span>
      </div>

      {/* Cover composition — image integrated upper-right, name layered over */}
      <div className="relative px-5 pt-8 sm:px-6 sm:pt-12 md:px-10 md:pt-14">
        <div className="relative">
          {/* Slideshow — upper right, ~46% wide, auto-cycles across projects */}
          <motion.div
            className="relative ml-auto w-full md:w-[46%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            style={{ y: imgY }}
          >
            <HeroSlideshow
              images={slideshowImages}
              group="masthead"
              interval={4500}
              aspect="4/3"
              alt="Selected work — Kith · Nordstrom"
            />
            <p className="mt-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
              <span>Across the practice</span>
              <span>Kith · Nordstrom</span>
            </p>
          </motion.div>

          {/* Name — absolutely overlaid, dominant focal element.
              Sits over the lower portion of the image so the two read as one
              integrated masthead. On mobile it stacks below the image. */}
          <motion.h1
            className="relative z-10 mt-6 md:absolute md:inset-x-0 md:bottom-[-0.18em] md:mt-0"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
            }}
            style={{
              fontWeight: 800,
              textTransform: 'uppercase',
              y: nameY,
            }}
          >
            <Reveal>
              <span className="block whitespace-nowrap text-[clamp(3.5rem,15vw,16rem)] leading-[0.82] tracking-[-0.045em] text-ink">
                Geordin
              </span>
            </Reveal>
            <Reveal>
              <span className="block whitespace-nowrap text-[clamp(2rem,9vw,10rem)] leading-[0.82] tracking-[-0.045em] text-signal mix-blend-multiply md:pl-[18%]">
                Zolliecoffer
              </span>
            </Reveal>
          </motion.h1>
        </div>
      </div>

      {/* Subtitle row — role, bio, status */}
      <div className="mt-12 grid grid-cols-12 gap-x-4 gap-y-6 border-t border-rule px-5 py-8 sm:px-6 md:mt-20 md:px-10 md:py-10">
        <p className="col-span-12 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft md:col-span-3">
          Currently —
        </p>
        <p className="col-span-12 max-w-[58ch] text-[clamp(0.9375rem,1.2vw,1.15rem)] font-medium leading-[1.5] text-ink md:col-span-7">
          Lead visual merchandiser. Working across{' '}
          <strong className="font-semibold">Kith Sunset</strong>, the{' '}
          <strong className="font-semibold">Nordstrom Thousand Oaks</strong> remodel,
          and the opening of <strong className="font-semibold">Kith&apos;s new West Hollywood flagship</strong>.
        </p>
        <div className="col-span-12 md:col-span-2 md:flex md:items-end md:justify-end">
          <span className="inline-flex items-center gap-2 border border-ink/30 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-signal-soft opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-soft" />
            </span>
            Open to projects
          </span>
        </div>
      </div>

      {/* Bottom scroll strip */}
      <div className="grid grid-cols-12 items-center gap-x-4 border-t border-rule px-5 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft sm:px-6 md:px-10">
        <span className="col-span-6">Scroll for archive ↓</span>
        <span className="col-span-6 text-right">001 / 003 · West Hollywood</span>
      </div>
    </section>
  )
}

function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.span className="block overflow-hidden" variants={{ hidden: {}, show: {} }}>
      <motion.span
        className="block"
        variants={{
          hidden: { y: '110%' },
          show: { y: '0%', transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}
