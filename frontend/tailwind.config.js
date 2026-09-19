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
          400: '#8E6F4F',
          500: '#755437',
          600: '#6F4E37', // Brand Primary Accent
          700: '#5A3D28', // Darker Primary Hover
          800: '#442D1D',
          900: '#2E1E13',
          950: '#1F1610', // Dark Espresso Text
        },
        // Stone mapped to high-contrast warm brown scale so all helper text is crisp and readable
        stone: {
          50: '#FAF8F5',
          100: '#F5EFEB',
          200: '#E8DFD1',
          300: '#D8CAB7',
          400: '#6F5849', // Crisper readable brown instead of faint light grey
          500: '#5A4537', // Deep warm brown
          600: '#443226', // Rich dark brown
          700: '#32231A', // Dark espresso brown
          800: '#231811', // Very dark brown
          900: '#1A110B', // Near black brown
          950: '#120B07',
        },
        // Slate mapped to warm coffee brown scale
        slate: {
          50: '#FAF8F5',
          100: '#1F1610', // Dark espresso brown
          200: '#32231A',
          300: '#443226',
          400: '#5A4537',
          500: '#6F4E37',
          600: '#5A3D28',
          700: '#442D1D',
          800: '#2E1E13',
          900: '#1F1610',
          950: '#120B07',
        },
        // Gray mapped to warm coffee brown scale
        gray: {
          50: '#FAF8F5',
          100: '#1F1610',
          200: '#32231A',
          300: '#443226',
          400: '#5A4537',
          500: '#6F4E37',
          600: '#5A3D28',
          700: '#442D1D',
          800: '#2E1E13',
          900: '#1F1610',
          950: '#120B07',
        },
        // Warm Beige & Neutral Tone Scale
        warm: {
          50: '#FAF8F5',
          100: '#F5EFEB',
          200: '#E8DFD1',
          300: '#D8CAB7',
          400: '#B8A48F',
          500: '#98806B',
          600: '#7B624E',
          700: '#5F4736',
          800: '#433023',
          900: '#2A1D15',
          950: '#1F1610',
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
          muted: '#5A4537',
          subtle: '#755437',
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
