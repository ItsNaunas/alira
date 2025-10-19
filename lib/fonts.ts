/**
 * Centralized Font & Color System for ALIRA
 * 
 * This file defines all font styles and text colors used across the entire application.
 * Use these utility functions instead of inline Tailwind classes to ensure consistency.
 */

// Font Family Constants
export const FONTS = {
  sans: 'font-sans',   // Lato - for body text, labels
  serif: 'font-serif', // Instrument Serif - for headings
} as const

// Font Weight Constants
export const WEIGHTS = {
  light: 'font-light',     // 300
  regular: 'font-normal',  // 400
  medium: 'font-medium',   // 500
  semibold: 'font-semibold', // 600
  bold: 'font-bold',       // 700
} as const

// Text Color Constants (Light + Dark Mode)
export const TEXT_COLORS = {
  // Primary text (headings, main content)
  primary: 'text-alira-onyx dark:text-alira-porcelain',
  
  // Secondary text (descriptions, body text)
  secondary: 'text-alira-onyx/80 dark:text-alira-porcelain/80',
  
  // Tertiary text (subtle text, captions)
  tertiary: 'text-alira-onyx/70 dark:text-alira-porcelain/70',
  
  // Muted text (very subtle, hints)
  muted: 'text-alira-onyx/60 dark:text-alira-porcelain/60',
  
  // Accent text (gold, highlights)
  accent: 'text-alira-gold',
  
  // Form input text
  input: 'text-alira-onyx dark:text-alira-porcelain',
  
  // Placeholder text
  placeholder: 'placeholder:text-alira-onyx/40 dark:placeholder:text-alira-porcelain/40',
} as const

// Typography Hierarchy - Use these for all text elements
export const typography = {
  // Main section headings (H1, H2) - Instrument Serif
  heading: {
    main: `${FONTS.serif} ${WEIGHTS.bold} text-alira-primary dark:text-alira-white`,
    sub: `${FONTS.serif} ${WEIGHTS.semibold} text-alira-primary dark:text-alira-white`,
  },
  
  // Body text - Lato (sans-serif)
  body: {
    regular: `${FONTS.sans} ${WEIGHTS.regular} text-alira-black/80 dark:text-alira-white/80`,
    muted: `${FONTS.sans} ${WEIGHTS.regular} text-alira-black/70 dark:text-alira-white/70`,
  },
  
  // Labels, badges, small text - Lato (sans-serif)
  label: {
    main: `${FONTS.sans} ${WEIGHTS.medium} text-alira-primary dark:text-alira-white`,
    muted: `${FONTS.sans} ${WEIGHTS.regular} text-alira-black/70 dark:text-alira-white/70`,
  },
  
  // Subtext - Instrument Serif Light Italic
  subtext: {
    main: `${FONTS.serif} italic ${WEIGHTS.light} text-alira-black/80 dark:text-alira-white/80`,
  },
} as const

// Helper functions to get consistent font + color classes
export const getHeadingClass = () => 'font-serif font-bold text-alira-primary dark:text-alira-white'
export const getSubHeadingClass = () => 'font-serif font-semibold text-alira-primary dark:text-alira-white'
export const getBodyClass = () => 'font-sans font-normal text-alira-black/80 dark:text-alira-white/80'
export const getLabelClass = () => 'font-sans font-medium text-alira-primary dark:text-alira-white'
export const getSubtextClass = () => 'font-serif italic font-light text-alira-black/80 dark:text-alira-white/80'
export const getInputClass = () => 'text-alira-black dark:text-alira-white placeholder:text-alira-black/40 dark:placeholder:text-alira-white/40'

// CSS-in-JS styles (for non-Tailwind usage)
export const fontStyles = {
  heading: {
    fontFamily: '"Instrument Serif", "Georgia", serif',
    fontWeight: 700,
  },
  subHeading: {
    fontFamily: '"Instrument Serif", "Georgia", serif',
    fontWeight: 600,
  },
  body: {
    fontFamily: '"Lato", "Inter", "Helvetica Neue", sans-serif',
    fontWeight: 400,
  },
  label: {
    fontFamily: '"Lato", "Inter", "Helvetica Neue", sans-serif',
    fontWeight: 500,
  },
  subtext: {
    fontFamily: '"Instrument Serif", "Georgia", serif',
    fontWeight: 300,
    fontStyle: 'italic',
  },
} as const

export default typography
