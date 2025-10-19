/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // ALIRA. Brand Colors
        alira: {
          primary: "#0B1D51",      // Deep navy blue - primary brand color
          gold: "#A06B00",         // Golden brown - accent color
          black: "#000000",        // Pure black - text and deep contrast
          white: "#FFFFFF",        // Pure white - backgrounds
          'primary-dark': '#081640', // Darker navy variant
          'primary-light': '#0e2a6e', // Lighter navy variant
          'gold-light': '#c79000',  // Lighter gold variant
          'gold-dark': '#7a5000',   // Darker gold variant
        },
      },
      fontFamily: {
        sans: ["Lato", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        heading: ["Instrument Serif", "Georgia", "serif"],
        body: ["Lato", "Helvetica Neue", "Arial", "sans-serif"],
      },
      fontSize: {
        'xs': ['0.875rem', { lineHeight: '1.5' }],      // Increased from 0.75rem
        'sm': ['1rem', { lineHeight: '1.5' }],          // Increased from 0.875rem
        'base': ['1.125rem', { lineHeight: '1.6' }],    // Increased from 1rem
        'lg': ['1.25rem', { lineHeight: '1.6' }],       // Increased from 1.125rem
        'xl': ['1.5rem', { lineHeight: '1.4' }],        // Increased from 1.25rem
        '2xl': ['1.875rem', { lineHeight: '1.4' }],     // Increased from 1.5rem
        '3xl': ['2.25rem', { lineHeight: '1.3' }],      // Increased from 1.875rem
        '4xl': ['2.75rem', { lineHeight: '1.2' }],      // Increased from 2.25rem
        '5xl': ['3.5rem', { lineHeight: '1.1' }],       // Increased from 3rem
        '6xl': ['4.5rem', { lineHeight: '1.1' }],       // Increased from 3.75rem
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      letterSpacing: {
        'tight': '-0.02em',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: 0, transform: "translateX(-20px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-in": "slide-in 0.6s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
