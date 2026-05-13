/**
 * Footer — one strip. Mark · index · copyright. No giant email reprise (Contact
 * already does that work). No socials.
 */
export function Footer() {
  return (
    <footer className="relative border-t border-rule bg-paper text-ink">
      {/* Mobile: 2 rows — [mark | index nav], then [© + email]. Desktop: 3 cols. */}
      <div className="grid grid-cols-12 gap-x-4 gap-y-6 px-5 py-8 sm:px-6 md:gap-y-0 md:px-10 md:py-10">
        <div className="col-span-6 flex flex-col gap-2 md:col-span-4">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
            <span className="inline-block h-2 w-2 rounded-full bg-signal" aria-hidden />
            Geordin Zolliecoffer
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft md:inline">
            Visual Merchandising · Los Angeles
          </span>
        </div>

        <nav className="col-span-6 md:col-span-4" aria-label="Footer navigation">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">Index</p>
          <ul className="mt-2 flex flex-col gap-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink">
            <li><a className="transition-colors hover:text-signal" href="/work">Work</a></li>
            <li><a className="transition-colors hover:text-signal" href="/about">About</a></li>
            <li><a className="transition-colors hover:text-signal" href="/contact">Contact</a></li>
          </ul>
        </nav>

        <div className="col-span-12 border-t border-rule pt-6 md:col-span-4 md:border-t-0 md:pt-0 md:text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">© 2026</p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink">
            hello@geordinzolliecoffer.com
          </p>
        </div>
      </div>
    </footer>
  )
}
