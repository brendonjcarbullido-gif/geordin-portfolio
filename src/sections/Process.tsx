import { motion } from 'framer-motion'

/**
 * Method — numbered manifesto. Four lines, one per principle. No icons, no
 * progress spine, no stacked cards. Just type and hairlines.
 */
const principles = [
  {
    word: 'Observe',
    body:
      'Every floorset starts on the floor — customer paths, conversion gaps, what is sitting, what is selling itself, what the next buy is asking the space to do.',
  },
  {
    word: 'Translate',
    body:
      'A seasonal buy, a marketing campaign, a brand voice — translated into a navigable floor, a story-led window, a mannequin that earns its space.',
  },
  {
    word: 'Execute',
    body:
      'Floor maps, mannequin styling, vinyl, signage, fixture redesign — installed on deadline, to standard, with the team trained alongside.',
  },
  {
    word: 'Refine',
    body:
      'Day-after walkthroughs, conversion data, what pulled the customer in, what did not. The work is not done at install.',
  },
] as const

export function Process() {
  return (
    <section
      id="process"
      className="relative bg-paper text-ink"
    >
      <div className="grid grid-cols-12 gap-x-4 border-y border-rule px-5 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft sm:px-6 md:px-10">
        <span className="col-span-6 md:col-span-3">Index 005 — Method</span>
        <span className="hidden md:col-span-6 md:block text-center text-ink">
          Floor first · brand always · customer last
        </span>
        <span className="col-span-6 text-right md:col-span-3">Four-step practice</span>
      </div>

      <ol className="divide-y divide-rule">
        {principles.map((p, i) => (
          <motion.li
            key={p.word}
            className="grid grid-cols-12 gap-x-4 px-5 py-12 sm:px-6 sm:py-16 md:px-10 md:py-20"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="col-span-2 font-mono text-[10px] uppercase leading-none tracking-[0.22em] text-ink-soft md:col-span-1">
              0{i + 1}
            </p>
            <h3 className="col-span-10 text-[clamp(2.5rem,8vw,7rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.035em] text-ink md:col-span-7">
              {p.word}
              <span className="text-signal">.</span>
            </h3>
            <p className="col-span-12 mt-6 max-w-[44ch] text-[14px] font-medium leading-[1.65] text-ink-soft md:col-span-4 md:col-start-9 md:mt-0 md:self-end md:text-[15px]">
              {p.body}
            </p>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}
