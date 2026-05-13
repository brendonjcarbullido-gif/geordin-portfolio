import { motion } from 'framer-motion'

/**
 * Capabilities — single tag grid, no accordion, no hover-expand. Each capability
 * is a chip. The eye reads the breadth in a single glance.
 */
const tags = [
  'Visual Merchandising',
  'Window Design',
  'Mannequin Styling',
  'Seasonal Floorsets',
  'Store Remodel Leadership',
  'Grand Opening Execution',
  'Team Training',
  'Cross-functional Partnership',
  'Brand Storytelling',
  'Vinyl & Signage Install',
  'Buy-to-Floor Translation',
  'Fixture Reinvention',
] as const

export function Expertise() {
  return (
    <section id="expertise" className="relative bg-paper text-ink">
      <div className="grid grid-cols-12 gap-x-4 border-b border-rule px-5 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft sm:px-6 md:px-10">
        <span className="col-span-6 md:col-span-3">Index 004 — Capabilities</span>
        <span className="hidden md:col-span-6 md:block text-center text-ink">12 disciplines · one practice</span>
        <span className="col-span-6 text-right md:col-span-3">Selected</span>
      </div>

      <div className="grid grid-cols-12 gap-x-4 gap-y-10 px-5 py-20 sm:px-6 sm:py-28 md:px-10 md:py-36">
        {/* Section headline */}
        <h2 className="col-span-12 text-display-lg font-extrabold uppercase leading-[0.88] tracking-[-0.035em] text-ink md:col-span-10">
          The full
          <br />
          <span className="text-ink-soft">visual.</span>
        </h2>

        {/* Tag grid — mobile: 2-col grid with full-width chips and tap-time
            underline. Desktop: flex-wrap with hover-fill (md+ has hover). */}
        <ul className="col-span-12 grid grid-cols-2 gap-2 md:col-span-10 md:flex md:flex-wrap md:gap-3">
          {tags.map((tag, i) => (
            <motion.li
              key={tag}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: i * 0.025 }}
              className="group"
            >
              <span className="block border border-ink/85 px-4 py-2 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors duration-300 active:underline active:decoration-signal active:decoration-2 active:underline-offset-[6px] md:inline-block md:px-5 md:py-3 md:text-left md:text-[12px] md:group-hover:bg-ink md:group-hover:text-paper md:active:no-underline">
                {tag}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
