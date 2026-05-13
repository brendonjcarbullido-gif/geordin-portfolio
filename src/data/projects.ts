import { image } from '@/lib/media'

export interface Project {
  id: string
  slug: string
  title: string
  client: string
  category: string
  year: string | number
  mediaType: 'image' | 'video'
  image?: string
  /** 4-image hero mosaic shown on the homepage WorkGrid chapter. */
  featured: string[]
  video?: string
  previewVideo?: string
  fullVideo?: string
  tint?: string
  caseStudy: {
    headline: string
    overview: string
    role: string
    deliverables: string[]
    images: string[]
    color: string
    results?: string[]
  }
}

/**
 * Image inventory (54 stills total)
 *   kith-west-hollywood : 25 stills  (-still-1 … -still-25)
 *   kith-sunset         :  9 stills  (-still-1 … -still-9; still-9 is the NBA All-Star activation)
 *   nordstrom-…         : 20 stills  (-still-1 … -still-20)
 *
 * `featured` picks the 4 visually strongest for the homepage mosaic.
 * `caseStudy.images` includes every plate so nothing is orphaned.
 */
export const projects: Project[] = [
  {
    id: '1',
    slug: 'kith-west-hollywood',
    title: 'A New Flagship on Sunset',
    client: 'Kith West Hollywood',
    category: 'Flagship Opening',
    year: 2024,
    mediaType: 'image',
    image: image('work/kith-west-hollywood-still-5.webp'),
    featured: [
      image('work/kith-west-hollywood-still-5.webp'),
      image('work/kith-west-hollywood-still-1.webp'),
      image('work/kith-west-hollywood-still-13.webp'),
      image('work/kith-west-hollywood-still-7.webp'),
    ],
    tint: '#3D4F8A',
    caseStudy: {
      headline: 'A new flagship on Sunset.',
      overview:
        "Visual merchandising leadership for the reopening and expansion of Kith's newest and largest U.S. flagship in West Hollywood — a $20M redevelopment transforming the retail footprint into a multi-level, experiential destination spanning men's, women's, kids', footwear, hospitality, and wellness. Partnered with store leadership, creative, operations, and merchandising to deliver elevated brand storytelling and customer experience across every department.",
      role: 'Lead Visual Merchandiser',
      deliverables: [
        'Multi-level Floor Strategy',
        'Mannequin Styling — All Departments',
        'Grand Opening Execution',
        'Cross-functional Coordination',
        'Brand Storytelling',
        'Window & In-store Displays',
      ],
      results: [
        '$20M Redevelopment',
        'Largest U.S. Flagship',
        'Men · Women · Kids · Footwear · Hospitality · Wellness',
      ],
      color: '#3D4F8A',
      images: [
        image('work/kith-west-hollywood-still-1.webp'),
        image('work/kith-west-hollywood-still-2.webp'),
        image('work/kith-west-hollywood-still-3.webp'),
        image('work/kith-west-hollywood-still-4.webp'),
        image('work/kith-west-hollywood-still-5.webp'),
        image('work/kith-west-hollywood-still-6.webp'),
        image('work/kith-west-hollywood-still-7.webp'),
        image('work/kith-west-hollywood-still-8.webp'),
        image('work/kith-west-hollywood-still-9.webp'),
        image('work/kith-west-hollywood-still-10.webp'),
        image('work/kith-west-hollywood-still-11.webp'),
        image('work/kith-west-hollywood-still-12.webp'),
        image('work/kith-west-hollywood-still-13.webp'),
        image('work/kith-west-hollywood-still-14.webp'),
        image('work/kith-west-hollywood-still-15.webp'),
        image('work/kith-west-hollywood-still-16.webp'),
        image('work/kith-west-hollywood-still-17.webp'),
        image('work/kith-west-hollywood-still-18.webp'),
        image('work/kith-west-hollywood-still-19.webp'),
        image('work/kith-west-hollywood-still-20.webp'),
        image('work/kith-west-hollywood-still-21.webp'),
        image('work/kith-west-hollywood-still-22.webp'),
        image('work/kith-west-hollywood-still-23.webp'),
        image('work/kith-west-hollywood-still-24.webp'),
        image('work/kith-west-hollywood-still-25.webp'),
      ],
    },
  },
  {
    id: '2',
    slug: 'kith-sunset',
    title: 'The Original Flagship',
    client: 'Kith Sunset',
    category: 'Visual Merchandising',
    year: '2016 — Present',
    mediaType: 'image',
    image: image('work/kith-sunset-still-2.webp'),
    featured: [
      image('work/kith-sunset-still-2.webp'),
      image('work/kith-sunset-still-9.webp'),
      image('work/kith-sunset-still-5.webp'),
      image('work/kith-sunset-still-7.webp'),
    ],
    tint: '#5C7FB8',
    caseStudy: {
      headline: 'The first Kith on the West Coast.',
      overview:
        "Stewarded the inaugural West Coast Kith — an intimate, distinctive space that served as the brand's first home outside New York. Built relationships across global retail visual merchandising, buying, operations, and store leadership; rebuilt outdated fixtures into selling stories; expanded the team to four assistants under a single training standard. The most recent activation was a complete floor redesign for the NBA All-Star weekend — apparel, accessories, mannequins, and merchandising standards calibrated for media and celebrity appearances.",
      role: 'Lead Visual Merchandiser',
      deliverables: [
        'Seasonal Floorsets',
        'Mannequin Styling',
        'NBA All-Star Activation',
        'Team Training (4 Assistants)',
        'Fixture Reinvention',
        'Collection Launches',
      ],
      results: [
        '4 Assistants Trained',
        'NBA All-Star Weekend Activation',
        'Conversion ↑',
      ],
      color: '#5C7FB8',
      images: [
        image('work/kith-sunset-still-1.webp'),
        image('work/kith-sunset-still-2.webp'),
        image('work/kith-sunset-still-3.webp'),
        image('work/kith-sunset-still-4.webp'),
        image('work/kith-sunset-still-5.webp'),
        image('work/kith-sunset-still-6.webp'),
        image('work/kith-sunset-still-7.webp'),
        image('work/kith-sunset-still-8.webp'),
        image('work/kith-sunset-still-9.webp'),
      ],
    },
  },
  {
    id: '3',
    slug: 'nordstrom-thousand-oaks',
    title: 'Remodel & Expansion',
    client: 'Nordstrom Thousand Oaks',
    category: 'Visual Merchandising',
    year: '2022 — 2024',
    mediaType: 'image',
    image: image('work/nordstrom-thousand-oaks-still-1.webp'),
    featured: [
      image('work/nordstrom-thousand-oaks-still-1.webp'),
      image('work/nordstrom-thousand-oaks-still-7.webp'),
      image('work/nordstrom-thousand-oaks-still-10.webp'),
      image('work/nordstrom-thousand-oaks-still-15.webp'),
    ],
    tint: '#1A1A1A',
    caseStudy: {
      headline: 'A full-store remodel, department by department.',
      overview:
        "A visual merchandising role at a low-traffic location that became an exercise in range. Stepped immediately into a full-store remodel as the trusted intermediary between the construction team and store team for VM. Started in women's apparel, lingerie, activewear, designer, and home goods — and by year two, expanded into beauty and fragrance, men's apparel and activewear, shoes, handbags, and kids'. Constantly shifting gears between floor maps, mannequin refreshes, monthly window installs, weekly signage and vinyl, and merchandising across every category in the store.",
      role: 'Visual Merchandiser',
      deliverables: [
        'Store Remodel Liaison',
        'Floor Maps & Layouts',
        'Monthly Window Installs',
        'Weekly Signage & Promotions',
        'Vinyl Installation',
        'Cross-Department Merchandising',
      ],
      results: [
        '12+ Departments Covered',
        'Full Store Remodel',
        'Construction ↔ Store Liaison',
      ],
      color: '#1A1A1A',
      images: [
        image('work/nordstrom-thousand-oaks-still-1.webp'),
        image('work/nordstrom-thousand-oaks-still-2.webp'),
        image('work/nordstrom-thousand-oaks-still-3.webp'),
        image('work/nordstrom-thousand-oaks-still-4.webp'),
        image('work/nordstrom-thousand-oaks-still-5.webp'),
        image('work/nordstrom-thousand-oaks-still-6.webp'),
        image('work/nordstrom-thousand-oaks-still-7.webp'),
        image('work/nordstrom-thousand-oaks-still-8.webp'),
        image('work/nordstrom-thousand-oaks-still-9.webp'),
        image('work/nordstrom-thousand-oaks-still-10.webp'),
        image('work/nordstrom-thousand-oaks-still-11.webp'),
        image('work/nordstrom-thousand-oaks-still-12.webp'),
        image('work/nordstrom-thousand-oaks-still-13.webp'),
        image('work/nordstrom-thousand-oaks-still-14.webp'),
        image('work/nordstrom-thousand-oaks-still-15.webp'),
        image('work/nordstrom-thousand-oaks-still-16.webp'),
        image('work/nordstrom-thousand-oaks-still-17.webp'),
        image('work/nordstrom-thousand-oaks-still-18.webp'),
        image('work/nordstrom-thousand-oaks-still-19.webp'),
        image('work/nordstrom-thousand-oaks-still-20.webp'),
      ],
    },
  },
]

// >>> begin auto-generated image dimensions — do not edit by hand
//     run `npm run measure-images` to regenerate
export const imageDimensions: Record<string, { w: number; h: number }> = {
  '/images/work/kith-sunset-still-1.webp': { w: 1121, h: 2400 },
  '/images/work/kith-sunset-still-2.webp': { w: 2400, h: 1121 },
  '/images/work/kith-sunset-still-3.webp': { w: 1121, h: 2400 },
  '/images/work/kith-sunset-still-4.webp': { w: 955, h: 2400 },
  '/images/work/kith-sunset-still-5.webp': { w: 2207, h: 1783 },
  '/images/work/kith-sunset-still-6.webp': { w: 1800, h: 2400 },
  '/images/work/kith-sunset-still-7.webp': { w: 1800, h: 2400 },
  '/images/work/kith-sunset-still-8.webp': { w: 2400, h: 1366 },
  '/images/work/kith-sunset-still-9.webp': { w: 1206, h: 1682 },
  '/images/work/kith-west-hollywood-still-1.webp': { w: 2400, h: 1800 },
  '/images/work/kith-west-hollywood-still-10.webp': { w: 2400, h: 1800 },
  '/images/work/kith-west-hollywood-still-11.webp': { w: 1800, h: 2400 },
  '/images/work/kith-west-hollywood-still-12.webp': { w: 2400, h: 1800 },
  '/images/work/kith-west-hollywood-still-13.webp': { w: 1800, h: 2400 },
  '/images/work/kith-west-hollywood-still-14.webp': { w: 2400, h: 1803 },
  '/images/work/kith-west-hollywood-still-15.webp': { w: 1800, h: 2400 },
  '/images/work/kith-west-hollywood-still-16.webp': { w: 1800, h: 2400 },
  '/images/work/kith-west-hollywood-still-17.webp': { w: 1800, h: 2400 },
  '/images/work/kith-west-hollywood-still-18.webp': { w: 1800, h: 2400 },
  '/images/work/kith-west-hollywood-still-19.webp': { w: 1800, h: 2400 },
  '/images/work/kith-west-hollywood-still-2.webp': { w: 1800, h: 2400 },
  '/images/work/kith-west-hollywood-still-20.webp': { w: 1800, h: 2400 },
  '/images/work/kith-west-hollywood-still-21.webp': { w: 1800, h: 2400 },
  '/images/work/kith-west-hollywood-still-22.webp': { w: 2400, h: 1651 },
  '/images/work/kith-west-hollywood-still-23.webp': { w: 2400, h: 1761 },
  '/images/work/kith-west-hollywood-still-24.webp': { w: 2400, h: 1476 },
  '/images/work/kith-west-hollywood-still-25.webp': { w: 2400, h: 1134 },
  '/images/work/kith-west-hollywood-still-3.webp': { w: 2400, h: 1298 },
  '/images/work/kith-west-hollywood-still-4.webp': { w: 2400, h: 1800 },
  '/images/work/kith-west-hollywood-still-5.webp': { w: 2400, h: 1800 },
  '/images/work/kith-west-hollywood-still-6.webp': { w: 2400, h: 2120 },
  '/images/work/kith-west-hollywood-still-7.webp': { w: 2400, h: 2101 },
  '/images/work/kith-west-hollywood-still-8.webp': { w: 1800, h: 2400 },
  '/images/work/kith-west-hollywood-still-9.webp': { w: 2400, h: 1800 },
  '/images/work/nordstrom-thousand-oaks-still-1.webp': { w: 2400, h: 1640 },
  '/images/work/nordstrom-thousand-oaks-still-10.webp': { w: 1800, h: 2400 },
  '/images/work/nordstrom-thousand-oaks-still-11.webp': { w: 1800, h: 2400 },
  '/images/work/nordstrom-thousand-oaks-still-12.webp': { w: 1800, h: 2400 },
  '/images/work/nordstrom-thousand-oaks-still-13.webp': { w: 2400, h: 2297 },
  '/images/work/nordstrom-thousand-oaks-still-14.webp': { w: 1238, h: 2400 },
  '/images/work/nordstrom-thousand-oaks-still-15.webp': { w: 2400, h: 1662 },
  '/images/work/nordstrom-thousand-oaks-still-16.webp': { w: 2400, h: 1612 },
  '/images/work/nordstrom-thousand-oaks-still-17.webp': { w: 1800, h: 2400 },
  '/images/work/nordstrom-thousand-oaks-still-18.webp': { w: 2400, h: 2309 },
  '/images/work/nordstrom-thousand-oaks-still-19.webp': { w: 2400, h: 1691 },
  '/images/work/nordstrom-thousand-oaks-still-2.webp': { w: 2400, h: 1800 },
  '/images/work/nordstrom-thousand-oaks-still-20.webp': { w: 2400, h: 1800 },
  '/images/work/nordstrom-thousand-oaks-still-3.webp': { w: 2400, h: 1800 },
  '/images/work/nordstrom-thousand-oaks-still-4.webp': { w: 2400, h: 1800 },
  '/images/work/nordstrom-thousand-oaks-still-5.webp': { w: 1469, h: 2400 },
  '/images/work/nordstrom-thousand-oaks-still-6.webp': { w: 1463, h: 2400 },
  '/images/work/nordstrom-thousand-oaks-still-7.webp': { w: 2400, h: 1800 },
  '/images/work/nordstrom-thousand-oaks-still-8.webp': { w: 2400, h: 1800 },
  '/images/work/nordstrom-thousand-oaks-still-9.webp': { w: 2400, h: 1800 },
}
// <<< end auto-generated image dimensions
