/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm-neutral ramp
        paper: 'var(--color-paper)',
        surface: 'var(--color-surface)',
        'surface-subtle': 'var(--color-surface-subtle)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        ink: 'var(--color-ink)',
        'ink-2': 'var(--color-ink-2)',
        muted: 'var(--color-muted)',
        faint: 'var(--color-faint)',
        // Accent green
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        'accent-subtle': 'var(--color-accent-subtle)',
        'accent-border': 'var(--color-accent-border)',
        // Semantic
        danger: 'var(--color-danger)',
        'danger-fill': 'var(--color-danger-fill)',
        'danger-border': 'var(--color-danger-border)',
        warning: 'var(--color-warning)',
        'warning-fill': 'var(--color-warning-fill)',
        'warning-border': 'var(--color-warning-border)',
      },
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        accent: ['var(--font-caveat)', 'cursive'],
      },
      fontSize: {
        display: [
          'var(--text-display)',
          {
            lineHeight: 'var(--text-display-lh)',
            fontWeight: 'var(--text-display-w)',
            letterSpacing: 'var(--text-display-ls)',
          },
        ],
        h1: [
          'var(--text-h1)',
          {
            lineHeight: 'var(--text-h1-lh)',
            fontWeight: 'var(--text-h1-w)',
            letterSpacing: 'var(--text-h1-ls)',
          },
        ],
        h2: [
          'var(--text-h2)',
          {
            lineHeight: 'var(--text-h2-lh)',
            fontWeight: 'var(--text-h2-w)',
            letterSpacing: 'var(--text-h2-ls)',
          },
        ],
        h3: [
          'var(--text-h3)',
          {
            lineHeight: 'var(--text-h3-lh)',
            fontWeight: 'var(--text-h3-w)',
            letterSpacing: 'var(--text-h3-ls)',
          },
        ],
        body: [
          'var(--text-body)',
          {
            lineHeight: 'var(--text-body-lh)',
            fontWeight: 'var(--text-body-w)',
            letterSpacing: 'var(--text-body-ls)',
          },
        ],
        'body-sm': [
          'var(--text-body-sm)',
          {
            lineHeight: 'var(--text-body-sm-lh)',
            fontWeight: 'var(--text-body-sm-w)',
            letterSpacing: 'var(--text-body-sm-ls)',
          },
        ],
        label: [
          'var(--text-label)',
          {
            lineHeight: 'var(--text-label-lh)',
            fontWeight: 'var(--text-label-w)',
            letterSpacing: 'var(--text-label-ls)',
          },
        ],
        caption: [
          'var(--text-caption)',
          {
            lineHeight: 'var(--text-caption-lh)',
            fontWeight: 'var(--text-caption-w)',
            letterSpacing: 'var(--text-caption-ls)',
          },
        ],
        overline: [
          'var(--text-overline)',
          {
            lineHeight: 'var(--text-overline-lh)',
            fontWeight: 'var(--text-overline-w)',
            letterSpacing: 'var(--text-overline-ls)',
          },
        ],
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
    },
  },
  plugins: [],
}
