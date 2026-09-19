/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Complete Coffee Brown Palette
        coffee: {
          50: '#FAF7F2',
          100: '#F4EFE6',
          200: '#E8DFD1',
          300: '#D3C3AD',
          400: '#A98E71',
          500: '#846345',
          600: '#6F4E37', // Brand Primary Accent
          700: '#5A3D28', // Darker Primary Hover
          800: '#442D1D',
          900: '#2E1E13',
          950: '#1F1610', // Dark Espresso Text
        },
        // Warm White & Crisp White Surfaces
        surface: {
          base: '#FAF8F5',       // Warm White page background
          card: '#FFFFFF',       // Crisp White card
          hover: '#F7F3EC',      // Subtle warm hover
          border: '#E8DFD1',     // Soft beige border
          'border-subtle': '#F0E8DC',
          darker: '#F4EFE6',     // Muted surface
        },
        // Espresso Typography
        espresso: {
          DEFAULT: '#1F1610',
          muted: '#635147',
          subtle: '#8E7B70',
        },
        // Legacy midnight mapping to warm espresso/coffee shades for seamless migration
        midnight: {
          950: '#1F1610',
          900: '#2E1E13',
          850: '#3A2719',
          800: '#442D1D',
          750: '#5A3D28',
          700: '#6F4E37',
        },
        // Primary brand accent alias
        cyan: {
          DEFAULT: '#6F4E37',
          hover: '#5A3D28',
          dim: 'rgba(111, 78, 55, 0.10)',
          glow: 'rgba(111, 78, 55, 0.20)',
          50: '#FAF7F2',
          100: '#F4EFE6',
          200: '#E8DFD1',
          300: '#D3C3AD',
          400: '#846345',
          500: '#6F4E37',
          600: '#5A3D28',
          700: '#442D1D',
          800: '#2E1E13',
          900: '#1F1610',
          950: '#150E0A',
        },
        // Restrained Financial Risk Status Colors
        risk: {
          safe: '#15803d',           // Green 700
          'safe-subtle': '#f0fdf4',
          warning: '#b45309',        // Amber 700
          'warning-subtle': '#fffbeb',
          critical: '#b91c1c',       // Red 700
          'critical-subtle': '#fef2f2',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(31, 22, 16, 0.05), 0 1px 2px -1px rgba(31, 22, 16, 0.05)',
        'card': '0 4px 16px -2px rgba(31, 22, 16, 0.06)',
        'card-hover': '0 8px 24px -4px rgba(31, 22, 16, 0.10)',
        'glow-coffee': '0 0 20px -5px rgba(111, 78, 55, 0.25)',
      }
    },
  },
  plugins: [],
}
