import { motion } from 'framer-motion'

const EMAIL = 'hello@geordinzolliecoffer.com'
const ease = [0.16, 1, 0.3, 1] as const

/**
 * Contact — oversized email block. The mailto link renders on a single
 * non-wrapping line; font-size is fluid-clamped to keep it inside the
 * viewport at any width.
 */
export function Contact() {
  return (
    <section id="contact" className="relative bg-paper text-ink">
      <div className="grid grid-cols-12 gap-x-4 border-y border-rule px-5 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft sm:px-6 md:px-10">
        <span className="col-span-6 md:col-span-3">Index 006 — Contact</span>
        <span className="hidden md:col-span-6 md:block text-center text-ink">
          Open for VM, windows, flagships, consulting
        </span>
        <span className="col-span-6 text-right md:col-span-3">Los Angeles ↗</span>
      </div>

      <div className="px-5 py-24 sm:px-6 sm:py-32 md:px-10 md:py-36">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
          Write
        </p>
        <motion.a
          href={`mailto:${EMAIL}`}
          data-cursor="Email"
          className="group mt-4 block text-[clamp(1.75rem,8vw,2.75rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-ink transition-colors duration-500 hover:text-signal md:whitespace-nowrap md:text-[clamp(1.5rem,3.8vw,4rem)] md:leading-[1]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease }}
        >
          {/* Three lines on mobile (block); one line on desktop (inline). The
              @ and . stay signal-blue, the whole element is one mailto target. */}
          <span className="block md:inline">HELLO<span className="text-signal group-hover:text-ink">@</span></span>
          <span className="block md:inline">GEORDINZOLLIECOFFER</span>
          <span className="block md:inline"><span className="text-signal group-hover:text-ink">.</span>COM</span>
        </motion.a>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
          Get in touch ↗
        </p>

        {/* Mobile: vertical stack with hairline dividers between rows.
            Desktop: 3-col grid (Based / Status / Open-to). */}
        <div className="mt-20 border-t border-rule md:mt-24 md:grid md:grid-cols-12 md:gap-x-4 md:gap-y-6 md:pt-12">
          <div className="border-b border-rule py-6 md:col-span-3 md:border-b-0 md:py-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">Based</p>
            <p className="mt-2 text-[14px] font-medium text-ink">Los Angeles, CA</p>
          </div>
          <div className="border-b border-rule py-6 md:col-span-3 md:border-b-0 md:py-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">Status</p>
            <p className="mt-2 text-[14px] font-medium text-ink">Open to projects</p>
          </div>
          <div className="py-6 md:col-span-6 md:py-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">Open to</p>
            <p className="mt-2 text-[14px] font-medium leading-[1.55] text-ink">
              Lead VM roles · Flagship openings · Freelance windows · Consulting on remodels and openings
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
