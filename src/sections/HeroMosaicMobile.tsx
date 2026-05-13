import { motion, useReducedMotion } from 'framer-motion'
import { image } from '@/lib/media'
import { HeroSlideshow } from '@/components/HeroSlideshow'

/**
 * Mobile masthead — vertical stack: full-bleed slideshow → stacked names →
 * metadata → scroll cue. No mix-blend-multiply on the second name (no image
 * behind it on mobile). Crossfade interval and image set match desktop.
 */
export function HeroMosaicMobile() {
  const reduce = useReducedMotion()

  const slideshowImages = [
    image('work/kith-west-hollywood-still-5.webp'),
    image('work/kith-sunset-still-2.webp'),
    image('work/nordstrom-thousand-oaks-still-1.webp'),
    image('work/kith-west-hollywood-still-13.webp'),
    image('work/kith-sunset-still-9.webp'),
    image('work/nordstrom-thousand-oaks-still-10.webp'),
  ]

  return (
    <section id="hero" className="relative bg-paper pt-24 text-ink">
      {/* Top metadata strip — keeps brand consistency with desktop top strip */}
      <div className="grid grid-cols-2 gap-x-4 border-b border-rule px-5 py-3 font-mono text-[10px] uppercase leading-none tracking-[0.22em] text-ink">
        <span>GZ — Vol. 01</span>
        <span className="text-right text-ink-soft">2016 → 2026</span>
      </div>

      {/* Full-bleed slideshow, h-[60vh] */}
      <motion.div
        className="relative h-[60vh] w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <HeroSlideshow
          images={slideshowImages}
          group="masthead"
          interval={4500}
          aspect=""
          className="!h-full"
          dotsAtBottom
          alt="Selected work — Kith · Nordstrom"
        />
      </motion.div>

      {/* Stacked names. text-display-xl token min is 3.5rem; spec asks for 3rem on
          mobile so we override the clamp inline rather than touch the token. */}
      <motion.h1
        className="px-5 pt-10 sm:px-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
        }}
        style={{ fontWeight: 800, textTransform: 'uppercase' }}
      >
        <Reveal>
          <span
            className="block whitespace-nowrap leading-[0.82] tracking-[-0.045em] text-ink"
            style={{ fontSize: 'clamp(3rem, 16vw, 12rem)' }}
          >
            Geordin
          </span>
        </Reveal>
        <Reveal>
          <span
            className="block whitespace-nowrap leading-[0.82] tracking-[-0.045em] text-signal"
            style={{ fontSize: 'clamp(2rem, 10.5vw, 8rem)' }}
          >
            Zolliecoffer
          </span>
        </Reveal>
      </motion.h1>

      {/* Vertical metadata stack: role/location → bio → status pill */}
      <div className="mt-10 flex flex-col gap-6 border-t border-rule px-5 py-7 sm:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
          Currently — Lead Visual Merchandiser · Los Angeles
        </p>
        <p className="max-w-[42ch] text-[1rem] font-medium leading-[1.55] text-ink">
          Working across <strong className="font-semibold">Kith Sunset</strong>, the{' '}
          <strong className="font-semibold">Nordstrom Thousand Oaks</strong> remodel,
          and the opening of <strong className="font-semibold">Kith&apos;s new West Hollywood flagship</strong>.
        </p>
        <span className="inline-flex w-fit items-center gap-2 self-center border border-ink/30 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-signal-soft opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-soft" />
          </span>
          Available for select projects
        </span>
      </div>

      {/* Scroll cue */}
      <div className="flex items-center justify-center gap-3 border-t border-rule px-5 py-5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft sm:px-6">
        <span>Scroll</span>
        <motion.span
          aria-hidden
          animate={reduce ? undefined : { y: [0, 4, 0] }}
          transition={reduce ? undefined : { duration: 1.6, ease: 'easeInOut', repeat: Infinity }}
          className="inline-block"
        >
          ↓
        </motion.span>
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
          show: { y: '0%', transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] } },
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}
