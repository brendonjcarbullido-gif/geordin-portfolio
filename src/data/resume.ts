export const resume = {
  identity: {
    name: 'Geordin Zolliecoffer',
    roles: ['Lead Visual Merchandiser', 'Window Designer', 'Brand Storyteller'],
    location: 'Los Angeles, CA',
    email: 'hello@geordinzolliecoffer.com',
    phone: '' as string,
    portfolio: 'geordinzolliecoffer.com',
    instagram: '' as string,
    linkedin: '' as string,
    resumePdf: '/files/GZPortfolio_24.pdf',
  },
  summary:
    'Lead visual merchandiser. Building stories in retail space — across the original Kith Sunset, the Nordstrom Thousand Oaks remodel, and the opening of Kith\'s new West Hollywood flagship. I build the story a customer walks into before they touch a single garment.',
  summaryShort:
    'Lead visual merchandiser. Windows, floorsets, and flagship openings across Kith and Nordstrom.',
  impact: [
    { value: '3', label: 'Flagships' },
    { value: '$20M', label: 'Flagship Redevelopment' },
    { value: '4', label: 'Assistants Trained' },
    { value: '12+', label: 'Departments Covered' },
  ],
  experience: [
    {
      title: 'Lead Visual Merchandiser',
      company: 'Kith West Hollywood',
      dateRange: '2024 – Present',
      current: true,
      bullets: [
        "Visual merchandising leadership for the reopening and expansion of Kith's newest and largest U.S. flagship in West Hollywood — a $20M redevelopment.",
        "Led VM execution for the multi-level experiential retail environment featuring men's, women's, kids', footwear, hospitality, and wellness concepts.",
        'Partnered cross-functionally with store leadership, creative, operations, and merchandising to open one of the most ambitious Kith retail concepts to date.',
        'Delivered elevated brand storytelling through immersive visual merchandising and customer experience execution at grand opening.',
      ],
    },
    {
      title: 'Lead Visual Merchandiser',
      company: 'Kith Sunset (Original Flagship)',
      dateRange: '2016 – Present',
      current: true,
      bullets: [
        "Stewarded the inaugural West Coast Kith — an intimate first home for the brand — with consistent visual standards and seasonal cadence.",
        'Built relationships with the Director of Global Retail Visual Merchandising, Buying, Store Operations, Sales, and department leadership.',
        'Spearheaded the NBA All-Star weekend activation — full floor redesign, all-star collection presentation, mannequin changes, and high-level merchandising for media and celebrity appearances.',
        'Expanded the team to four assistants and trained them to uphold the brand\'s visual standards. Met every collection deadline; improved conversion rates; lifted product sales through innovative fixture redesigns within a constrained footprint.',
      ],
    },
    {
      title: 'Visual Merchandiser',
      company: 'Nordstrom — Thousand Oaks',
      dateRange: '2022 – 2024',
      bullets: [
        'Stepped immediately into a full-store remodel as the trusted intermediary between the construction team and store team for visual merchandising.',
        "Started across women's apparel, lingerie, activewear, designer, and home goods.",
        "By year two, expanded scope to beauty and fragrance, men's apparel and activewear, shoes, handbags, and kids'.",
        'Owned floor maps and layouts, mannequin refreshes, monthly window installs, weekly signage and promotions, vinyl installation, and full-floor merchandising across every category.',
      ],
    },
  ],
  skills: {
    direction: ['Visual Merchandising', 'Window Design', 'Mannequin Styling', 'Seasonal Floorsets'],
    production: ['Store Remodel Management', 'Vinyl & Signage Install', 'Grand Opening Execution', 'Fixture Reinvention'],
    tools: ['Cross-functional Leadership', 'Team Training', 'Buy-to-Floor Translation', 'Brand Storytelling'],
  },
  industries: [
    'Streetwear',
    'Luxury Department Store',
    'Multi-level Flagship',
    'Beauty & Fragrance',
    'Designer Apparel',
    'Home Goods',
  ],
  education: {
    school: 'Fashion Institute of Design and Merchandising (FIDM)',
    degree: 'Visual Communications',
    focus: 'Merchandising & Styling',
    emphasis: 'Window Design · Storytelling',
    years: '2013 – 2015',
  },
  clients: ['Kith', 'Nordstrom'],
} as const

export type Resume = typeof resume
