/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#060913',
          900: '#0a0f1d',
          850: '#0e1628',
          800: '#131f37',
          750: '#192846',
          700: '#223356',
        },
        surface: {
          darker: '#090e1a',
          base: '#0d1527',
          card: '#121d33',
          hover: '#172542',
          border: '#1b2a47',
          'border-subtle': '#152238',
        },
        cyan: {
          DEFAULT: '#00f0ff',
          hover: '#38bdf8',
          dim: 'rgba(0, 240, 255, 0.15)',
          glow: 'rgba(0, 240, 255, 0.35)',
        },
        risk: {
          safe: '#10b981',
          'safe-subtle': 'rgba(16, 185, 129, 0.12)',
          warning: '#f59e0b',
          'warning-subtle': 'rgba(245, 158, 11, 0.12)',
          critical: '#ef4444',
          'critical-subtle': 'rgba(239, 68, 68, 0.12)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -5px rgba(0, 240, 255, 0.3)',
        'glow-danger': '0 0 20px -5px rgba(239, 68, 68, 0.3)',
        'glow-safe': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
