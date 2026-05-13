import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useFocusTrap } from '@/hooks/useFocusTrap'

const links = [
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

/**
 * Nav — fixed top strip in mono. Always reads on the paper bg; flips to paper
 * text when scrolled over dark sections via mix-blend-difference.
 */
export function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  useFocusTrap(menuRef, open)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-40 mt-9 bg-paper/95 backdrop-blur-sm md:mt-0 md:bg-transparent md:backdrop-blur-none md:mix-blend-difference"
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <div className="flex items-center justify-between px-5 py-3 text-ink sm:px-6 md:px-10 md:py-6 md:text-paper">
          <NavLink
            to="/"
            end
            aria-label="Geordin Zolliecoffer — Home"
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]"
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-soft" aria-hidden />
            <span className="hidden sm:inline">Geordin Zolliecoffer</span>
            <span className="sm:hidden">GZ</span>
          </NavLink>

          <nav className="hidden md:block" aria-label="Primary">
            <ul className="flex items-center gap-8">
              {links.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `group relative font-mono text-[10px] uppercase tracking-[0.22em] transition-opacity duration-300 ${
                        isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span>{label}</span>
                        <span
                          className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-paper transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 ${
                            isActive ? 'scale-x-100' : ''
                          }`}
                          aria-hidden
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="flex h-6 w-6 flex-col items-center justify-center gap-1.5">
              <span className={`block h-px w-5 transition-transform duration-300 ${open ? 'translate-y-[3px] rotate-45 bg-paper' : 'bg-ink'}`} />
              <span className={`block h-px w-5 transition-transform duration-300 ${open ? '-translate-y-[3px] -rotate-45 bg-paper' : 'bg-ink'}`} />
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            key="mobile-menu"
            className="fixed inset-0 z-[50] bg-ink text-paper md:hidden"
            initial={reduce ? { opacity: 0 } : { y: '-100%' }}
            animate={reduce ? { opacity: 1 } : { y: '0%' }}
            exit={reduce ? { opacity: 0 } : { y: '-100%' }}
            transition={{ duration: reduce ? 0.18 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="relative flex h-full flex-col justify-between px-6 py-8"
              style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))' }}
            >
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em]">
                <span className="inline-flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal-soft" aria-hidden />
                  Geordin Zolliecoffer
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="-mr-2 inline-flex h-11 items-center gap-2 whitespace-nowrap px-2 text-paper/80"
                  aria-label="Close menu"
                >
                  Close <span aria-hidden>✕</span>
                </button>
              </div>

              <ul className="flex flex-col gap-7">
                {links.map(({ to, label }, i) => (
                  <motion.li
                    key={to}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: reduce ? 0.18 : 0.55,
                      ease: [0.16, 1, 0.3, 1],
                      delay: reduce ? 0 : 0.12 + i * 0.06,
                    }}
                  >
                    <NavLink to={to} className="group block">
                      {({ isActive }) => (
                        <span className="flex items-baseline gap-5">
                          <span className="w-7 shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/55">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={`block text-[clamp(2.75rem,11vw,5rem)] font-bold uppercase leading-[0.92] tracking-[-0.03em] transition-colors duration-300 ${
                              isActive ? 'text-signal-soft' : 'text-paper'
                            }`}
                          >
                            {label}
                          </span>
                        </span>
                      )}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-paper/70">
                <span>hello@geordinzolliecoffer.com</span>
                <span>Los Angeles · Open to projects</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
