/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", "class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			alira: {
  				primary: '#0B1D51',
  				gold: '#A06B00',
  				black: '#000000',
  				white: '#FFFFFF',
  				'primary-dark': '#081640',
  				'primary-light': '#0e2a6e',
  				'gold-light': '#c79000',
  				'gold-dark': '#7a5000'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Lato',
  				'Helvetica Neue',
  				'Arial',
  				'sans-serif'
  			],
  			serif: [
  				'Instrument Serif',
  				'Georgia',
  				'serif'
  			],
  			heading: [
  				'Instrument Serif',
  				'Georgia',
  				'serif'
  			],
  			body: [
  				'Lato',
  				'Helvetica Neue',
  				'Arial',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			xs: [
  				'0.875rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			sm: [
  				'1rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			base: [
  				'1.125rem',
  				{
  					lineHeight: '1.6'
  				}
  			],
  			lg: [
  				'1.25rem',
  				{
  					lineHeight: '1.6'
  				}
  			],
  			xl: [
  				'1.5rem',
  				{
  					lineHeight: '1.4'
  				}
  			],
  			'2xl': [
  				'1.875rem',
  				{
  					lineHeight: '1.4'
  				}
  			],
  			'3xl': [
  				'2.25rem',
  				{
  					lineHeight: '1.3'
  				}
  			],
  			'4xl': [
  				'2.75rem',
  				{
  					lineHeight: '1.2'
  				}
  			],
  			'5xl': [
  				'3.5rem',
  				{
  					lineHeight: '1.1'
  				}
  			],
  			'6xl': [
  				'4.5rem',
  				{
  					lineHeight: '1.1'
  				}
  			]
  		},
		spacing: {
			'18': '4.5rem',
			'88': '22rem',
			// Semantic spacing for sections
			'section-xs': '2rem',     // 32px - extra small sections
			'section-sm': '4rem',     // 64px - small sections
			'section-md': '6rem',     // 96px - standard sections
			'section-lg': '8rem',     // 128px - large sections
			'section-xl': '10rem',    // 160px - extra large sections
			// Semantic spacing for cards
			'card-xs': '0.75rem',     // 12px - very tight card padding
			'card-sm': '1rem',        // 16px - tight card padding
			'card-md': '1.5rem',      // 24px - standard card padding
			'card-lg': '2rem',        // 32px - spacious card padding
			'card-xl': '2.5rem',      // 40px - extra spacious card padding
			// Element spacing
			'element-xs': '0.5rem',   // 8px - very tight element spacing
			'element-sm': '1rem',     // 16px - tight element spacing
			'element-md': '1.5rem',   // 24px - standard element spacing
			'element-lg': '2rem',     // 32px - loose element spacing
		},
  		letterSpacing: {
  			tight: '-0.02em'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: 0
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: 0
  				}
  			},
  			'fade-in': {
  				'0%': {
  					opacity: 0,
  					transform: 'translateY(10px)'
  				},
  				'100%': {
  					opacity: 1,
  					transform: 'translateY(0)'
  				}
  			},
  			'slide-in': {
  				'0%': {
  					opacity: 0,
  					transform: 'translateX(-20px)'
  				},
  				'100%': {
  					opacity: 1,
  					transform: 'translateX(0)'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fade-in 0.6s ease-out',
  			'slide-in': 'slide-in 0.6s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}
