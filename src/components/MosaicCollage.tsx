import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { LightboxImage } from '@/components/Lightbox'

/**
 * MosaicCollage — 4-image asymmetric magazine collage on a 12-col × 3-row
 * grid. The lead image spans all three rows; the three side images each
 * take one row. Heights stay matched between the two columns (no empty
 * space, no orphan captions). Each image rides its own scroll-driven 3D
 * track so the cluster breathes as the user scrolls.
 *
 *   ┌──────────────┬──────────┐
 *   │              │  img 2   │
 *   │              ├──────────┤
 *   │   LEAD       │  img 3   │
 *   │              ├──────────┤
 *   │              │  img 4   │
 *   └──────────────┴──────────┘
 */

interface Props {
  images: string[]
  group: string
  client: string
  reverse?: boolean
}

export function MosaicCollage({ images, group, client, reverse = false }: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Each image: its own scroll-driven 3D track (y/rotate/translateZ).
  const lead = use3D(scrollYProgress, reduce, { y: 30, rotate: -1.0, z: 0 })
  const top  = use3D(scrollYProgress, reduce, { y: 80, rotate:  1.4, z: 20 })
  const mid  = use3D(scrollYProgress, reduce, { y: 120, rotate: -1.0, z: -12 })
  const bot  = use3D(scrollYProgress, reduce, { y: 60, rotate:  1.6, z: 8 })

  const [i1, i2, i3, i4] = images
  // On desktop: reverse swaps which side has the lead vs the stack.
  const leadStart = reverse ? 'md:col-start-5' : 'md:col-start-1'
  const sideStart = reverse ? 'md:col-start-1' : 'md:col-start-9'

  return (
    <div
      ref={ref}
      className="grid grid-cols-12 gap-3 md:grid-rows-3 md:gap-4"
      style={{
        perspective: '1600px',
      }}
    >
      {/* Lead — spans all 3 rows × 8 cols. Fills its grid cell vertically;
          height is determined by the side stack (3 × side aspect ratios). */}
      <MosaicImage
        src={i1}
        group={group}
        alt={`${client} — lead plate`}
        className={`col-span-12 aspect-[4/5] md:col-span-8 md:aspect-auto md:row-span-3 ${leadStart}`}
        motion3d={lead}
        eager
      />

      {/* Three side cells — each given an aspect ratio so the row heights
          are deterministic and the lead's 3-row span has a real height. */}
      <MosaicImage
        src={i2}
        group={group}
        alt={`${client} — plate 02`}
        className={`col-span-12 aspect-[4/3] md:col-span-4 md:row-span-1 ${sideStart}`}
        motion3d={top}
      />
      <MosaicImage
        src={i3}
        group={group}
        alt={`${client} — plate 03`}
        className={`col-span-12 aspect-[4/3] md:col-span-4 md:row-span-1 ${sideStart}`}
        motion3d={mid}
      />
      <MosaicImage
        src={i4}
        group={group}
        alt={`${client} — plate 04`}
        className={`col-span-12 aspect-[4/3] md:col-span-4 md:row-span-1 ${sideStart}`}
        motion3d={bot}
      />
    </div>
  )
}

type ThreeDTrack = ReturnType<typeof use3D>

function MosaicImage({
  src,
  group,
  alt,
  className,
  motion3d,
  eager,
}: {
  src: string
  group: string
  alt: string
  className: string
  motion3d: ThreeDTrack
  eager?: boolean
}) {
  return (
    <motion.figure
      className={`group relative overflow-hidden bg-paper-2 ${className}`}
      style={{
        y: motion3d.y,
        rotateY: motion3d.rotate,
        translateZ: motion3d.z,
        transformStyle: 'preserve-3d',
      }}
    >
      <LightboxImage
        src={src}
        group={group}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
      />
    </motion.figure>
  )
}

/**
 * Hook: derive y / rotate / translateZ motion values from scroll progress.
 */
function use3D(
  progress: ReturnType<typeof useScroll>['scrollYProgress'],
  reduce: boolean | null,
  mag: { y: number; rotate: number; z: number },
) {
  const y = useTransform(progress, [0, 1], reduce ? [0, 0] : [mag.y, -mag.y])
  const rotate = useTransform(progress, [0, 1], reduce ? [0, 0] : [-mag.rotate, mag.rotate])
  const z = useTransform(progress, [0, 1], reduce ? [0, 0] : [-mag.z, mag.z])
  return { y, rotate, z }
}
