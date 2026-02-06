import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx,html}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--color-bg-primary)',
        'bg-secondary': 'var(--color-bg-secondary)',
        'bg-cell': 'var(--color-bg-cell)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-dim': 'var(--color-text-dim)',
        accent: 'var(--color-accent)',
        danger: 'var(--color-danger)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        'card-bg': 'var(--color-card-bg)',
        'border-color': 'var(--color-border)',
      },
      width: {
        popup: '400px',
      },
      maxHeight: {
        popup: '600px',
      },
    },
  },
  plugins: [],
} satisfies Config
