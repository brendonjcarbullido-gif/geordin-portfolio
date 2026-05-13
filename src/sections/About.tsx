import { image } from '@/lib/media'
import { LightboxImage } from '@/components/Lightbox'

/**
 * About — inverse (black) editorial spread. Manifesto headline, two short
 * prose blocks, numeric stat strip. Side image renders edge-to-edge in its
 * column (no letterbox frame) at native ratio.
 */
export function About() {
  return (
    <section id="about" className="relative bg-ink text-paper">
      {/* Top metadata strip */}
      <div className="grid grid-cols-12 gap-x-4 border-b border-paper/15 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/70 sm:px-6 md:px-10">
        <span className="col-span-6 md:col-span-3">Index 003 — About</span>
        <span className="hidden md:col-span-6 md:block text-center">A working method, not a methodology</span>
        <span className="col-span-6 text-right md:col-span-3">FIDM · 2013 — 2015</span>
      </div>

      <div className="relative px-5 py-20 sm:px-6 sm:py-28 md:px-10 md:py-36">
        {/* Mobile-only watercolor accent — single soft signal-blue blur behind
            the manifesto headline, static (no scroll motion). Hidden on desktop
            so the existing composition is preserved. */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-20 -z-0 -translate-x-1/2 md:hidden">
          <div className="h-72 w-72 rounded-full bg-signal/35 blur-3xl" />
        </div>
        <div className="relative z-10 grid grid-cols-12 gap-x-4 gap-y-12">
          {/* Manifesto headline — condensed to two lines, mid-size */}
          <h2 className="col-span-12 text-[clamp(1.75rem,4.2vw,4.25rem)] font-extrabold uppercase leading-[0.96] tracking-[-0.025em] text-paper md:col-span-10">
            I build the story a customer walks into
            <br />
            <span className="text-paper/55">before they touch a single garment.</span>
          </h2>

          {/* Body + image */}
          <div className="col-span-12 mt-10 grid grid-cols-12 gap-x-4 gap-y-10 border-t border-paper/15 pt-12 md:mt-16">
            {/* Side image — native ratio, no frame */}
            <div className="col-span-12 md:col-span-5">
              <LightboxImage
                src={image('work/kith-west-hollywood-still-7.webp')}
                group="about"
                alt="Visual merchandising — flagship floor"
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">
                Fig. 01 — Kith W.H., 2024
              </p>
            </div>

            {/* Body prose — two short blocks */}
            <div className="col-span-12 grid grid-cols-1 gap-8 md:col-span-6 md:col-start-7 md:grid-cols-2 md:gap-10">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">
                  001 — Foundation
                </p>
                <p className="mt-4 text-[14px] font-medium leading-[1.6] text-paper md:text-[15px]">
                  Trained at FIDM in Visual Communications. Stewarded the
                  original Kith Sunset — the first West Coast Kith — through
                  countless seasonal floorsets, collection launches, an NBA
                  All-Star weekend activation, and the slow patient work of
                  training a four-person team to a single brand standard.
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/60">
                  002 — Range
                </p>
                <p className="mt-4 text-[14px] font-medium leading-[1.6] text-paper md:text-[15px]">
                  Nordstrom Thousand Oaks pulled me into a full-store remodel,
                  scaling from women&apos;s apparel into beauty, men&apos;s, shoes,
                  handbags, kids&apos;, and home. Most recently, the opening of
                  Kith&apos;s new West Hollywood flagship — a $20M multi-level
                  redevelopment spanning men&apos;s, women&apos;s, kids&apos;, footwear,
                  hospitality, and wellness.
                </p>
              </div>
            </div>
          </div>

          {/* Numerical strip */}
          <div className="col-span-12 mt-8 grid grid-cols-2 gap-y-10 border-t border-paper/15 pt-12 md:grid-cols-4">
            <Stat value="03" label="Flagships" />
            <Stat value="$20M" label="Flagship redevelopment" />
            <Stat value="04" label="Assistants trained" />
            <Stat value="12+" label="Departments covered" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-none tracking-[-0.03em] text-paper">
        {value}
      </p>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/65">
        {label}
      </p>
    </div>
  )
}
