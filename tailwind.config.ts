import type { Config } from 'tailwindcss'

/**
 * Geordin Zolliecoffer — design system v2.
 *
 * Direction: high-contrast modern editorial. No italic serifs, no warm cream paper,
 * no center-justified marquee. Bold geometric sans display + monospace utility labels.
 * Aimé Leon Dore archive × Highsnobiety editorial × Margiela retail.
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paper — near-white, slight warmth to avoid clinical
        paper: '#F6F4EF',
        'paper-2': '#EDEAE2',
        // Ink — near-black
        ink: '#0E0E0E',
        'ink-2': '#1A1A1A',
        'ink-soft': '#8A8780',
        // Hairline
        rule: 'rgba(14,14,14,0.14)',
        // Single signal — kept from her PDF brand
        signal: '#3D4F8A',
        'signal-soft': '#5C7FB8',

        // -- Legacy template aliases kept to avoid breaking any imports.
        // -- The new sections do NOT use these; they reference paper/ink/signal directly.
        cream: '#F6F4EF',
        'cream-2': '#EDEAE2',
        'cream-3': '#E2DDCF',
        'ink-light': '#8A8780',
        accent: '#3D4F8A',
        'accent-deep': '#0E0E0E',
        gold: '#3D4F8A',
        muted: '#8A8780',
        'card-bg': '#0E0E0E',
        'border-subtle': '#1A1A1A',
        'ink-deep': '#000000',
        'cream-ds': '#EDEAE2',
      },
      fontFamily: {
        // Display + body — one bold geometric sans family used across the whole site
        sans: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
        // No italic serif. `serif` alias points at the same sans so any legacy ref still renders.
        serif: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
        // Mono — every label, every eyebrow, every gutter mark
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        bebas: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 14vw, 16rem)', { lineHeight: '0.84', letterSpacing: '-0.045em' }],
        'display-lg': ['clamp(2.75rem, 9vw, 10rem)', { lineHeight: '0.88', letterSpacing: '-0.035em' }],
        'display-md': ['clamp(2rem, 5vw, 5rem)', { lineHeight: '0.94', letterSpacing: '-0.025em' }],
        'eyebrow': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.22em' }],
        'caption': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.18em' }],
      },
      transitionTimingFunction: {
        'v3-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        snap: 'cubic-bezier(0.65, 0.01, 0.35, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
