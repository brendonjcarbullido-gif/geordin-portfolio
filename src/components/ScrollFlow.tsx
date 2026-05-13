import { useScroll, useSpring, useTransform, motion, useReducedMotion } from 'framer-motion'

/**
 * ScrollFlow — fixed-position decorative element that drifts with scroll.
 *
 * A soft watercolor orb (signal-blue radial gradient, blurred) sits in the
 * left gutter behind the content and slides vertically + rotates as the
 * page scrolls. Echoes the watercolor motif from Geordin's PDF brand
 * without competing with content.
 *
 * Hidden under reduced-motion. Always behind page content via z-0 and
 * `pointer-events-none`.
 */
export function ScrollFlow() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()

  // Smooth the raw scroll progress for a softer ride.
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 24,
    mass: 0.6,
  })

  // Vertical drift across the viewport — gentle, doesn't fly off-screen.
  const y = useTransform(smoothed, [0, 1], ['8vh', '70vh'])
  const rotate = useTransform(smoothed, [0, 1], [0, 220])
  const scale = useTransform(smoothed, [0, 0.5, 1], [1, 1.18, 0.95])
  // Subtle horizontal drift so the orb feels alive, not on rails.
  const x = useTransform(smoothed, [0, 0.5, 1], ['0vw', '6vw', '-2vw'])

  if (reduce) return null

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-[-6vw] top-0 z-0 hidden md:block"
      style={{ x, y, rotate, scale }}
    >
      <svg
        width="34vw"
        height="34vw"
        viewBox="0 0 600 600"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '34vw', height: '34vw', maxWidth: '520px', maxHeight: '520px' }}
      >
        <defs>
          <radialGradient id="flow-grad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#7E9CCC" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#5C7FB8" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#3D4F8A" stopOpacity="0" />
          </radialGradient>
          <filter id="flow-blur">
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>
        <path
          d="M180,120 C270,90 360,90 430,150 C500,210 530,300 470,380 C410,460 320,500 240,490 C160,480 100,410 100,330 C100,250 110,160 180,120 Z"
          fill="url(#flow-grad)"
          filter="url(#flow-blur)"
        />
      </svg>
    </motion.div>
  )
}
