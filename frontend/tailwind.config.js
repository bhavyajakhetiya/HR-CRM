/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Surface colors
        'surface':                    '#f8f9ff',
        'surface-dim':                '#cbdbf5',
        'surface-bright':             '#f8f9ff',
        'surface-container-lowest':   '#ffffff',
        'surface-container-low':      '#eff4ff',
        'surface-container':          '#e5eeff',
        'surface-container-high':     '#dce9ff',
        'surface-container-highest':  '#d3e4fe',
        'surface-variant':            '#d3e4fe',
        'surface-tint':               '#4d44e3',

        // Content on surface
        'on-surface':                 '#0b1c30',
        'on-surface-variant':         '#464555',
        'inverse-surface':            '#213145',
        'inverse-on-surface':         '#eaf1ff',

        // Outline
        'outline':                    '#777587',
        'outline-variant':            '#c7c4d8',

        // Primary (Electric Indigo)
        'primary':                    '#3525cd',
        'on-primary':                 '#ffffff',
        'primary-container':          '#4f46e5',
        'on-primary-container':       '#dad7ff',
        'inverse-primary':            '#c3c0ff',
        'primary-fixed':              '#e2dfff',
        'primary-fixed-dim':          '#c3c0ff',
        'on-primary-fixed':           '#0f0069',
        'on-primary-fixed-variant':   '#3323cc',

        // Secondary (Soft Violet)
        'secondary':                  '#831ada',
        'on-secondary':               '#ffffff',
        'secondary-container':        '#9e41f5',
        'on-secondary-container':     '#fffbff',
        'secondary-fixed':            '#f0dbff',
        'secondary-fixed-dim':        '#ddb8ff',
        'on-secondary-fixed':         '#2c0051',
        'on-secondary-fixed-variant': '#6800b4',

        // Tertiary
        'tertiary':                   '#454853',
        'on-tertiary':                '#ffffff',
        'tertiary-container':         '#5d606b',
        'on-tertiary-container':      '#d9dbe8',
        'tertiary-fixed':             '#e0e2ef',
        'tertiary-fixed-dim':         '#c3c6d2',
        'on-tertiary-fixed':          '#181b24',
        'on-tertiary-fixed-variant':  '#434751',

        // Error
        'error':                      '#ba1a1a',
        'on-error':                   '#ffffff',
        'error-container':            '#ffdad6',
        'on-error-container':         '#93000a',

        // Background
        'background':                 '#f8f9ff',
        'on-background':              '#0b1c30',
      },

      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },

      fontSize: {
        'display-lg':  ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'title-lg':    ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg':     ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md':     ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md':    ['12px', { lineHeight: '16px', fontWeight: '500' }],
        // Mobile variants
        'headline-lg-mobile': ['28px', { lineHeight: '36px', fontWeight: '600' }],
      },

      borderRadius: {
        'sm':      '0.25rem',
        DEFAULT:   '0.5rem',
        'md':      '0.75rem',
        'lg':      '1rem',
        'xl':      '1.5rem',
        '2xl':     '1.5rem',
        '3xl':     '2rem',
        'full':    '9999px',
      },

      spacing: {
        'base':               '8px',
        'container-padding':  '32px',
        'card-gap':           '24px',
        'section-margin':     '40px',
        'gutter':             '24px',
        // Fixed panel widths
        'sidebar':            '280px',
        'right-panel':        '320px',
      },

      boxShadow: {
        'card':    '0 4px 20px rgba(0, 0, 0, 0.05)',
        'card-lg': '0 10px 30px rgba(0, 0, 0, 0.08)',
        'primary': '0 10px 30px rgba(53, 37, 205, 0.2)',
        'glass':   '0 8px 32px rgba(31, 38, 135, 0.07)',
      },
    },
  },
  plugins: [],
}
