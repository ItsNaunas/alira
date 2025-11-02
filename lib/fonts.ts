/**
 * Centralized Font & Color System for ALIRA
 * 
 * This file defines all font styles and text colors used across the entire application.
 * Use these utility functions instead of inline Tailwind classes to ensure consistency.
 * 
 * Note: Dark mode is disabled. All color tokens use semantic tokens from the design system.
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

// Text Color Constants (Using Semantic Tokens)
// All colors use semantic tokens from the design system
export const TEXT_COLORS = {
  // Primary text (headings, main content)
  primary: 'text-text-primary',
  
  // Secondary text (descriptions, body text)
  secondary: 'text-text-secondary',
  
  // Tertiary text (subtle text, captions)
  tertiary: 'text-text-tertiary',
  
  // Muted text (very subtle, hints) - using secondary with lower opacity
  muted: 'text-text-secondary',
  
  // Accent text (gold, highlights)
  accent: 'text-accent',
  
  // Form input text
  input: 'text-text-primary',
  
  // Placeholder text
  placeholder: 'placeholder:text-text-tertiary',
} as const

// Typography Hierarchy - Use these for all text elements
export const typography = {
  // Main section headings (H1, H2) - Instrument Serif
  heading: {
    main: `${FONTS.serif} ${WEIGHTS.bold} text-text-primary`,
    sub: `${FONTS.serif} ${WEIGHTS.semibold} text-text-primary`,
  },
  
  // Body text - Lato (sans-serif)
  body: {
    regular: `${FONTS.sans} ${WEIGHTS.regular} text-text-secondary`,
    muted: `${FONTS.sans} ${WEIGHTS.regular} text-text-tertiary`,
  },
  
  // Labels, badges, small text - Lato (sans-serif)
  label: {
    main: `${FONTS.sans} ${WEIGHTS.medium} text-text-primary`,
    muted: `${FONTS.sans} ${WEIGHTS.regular} text-text-tertiary`,
  },
  
  // Subtext - Instrument Serif Light Italic
  subtext: {
    main: `${FONTS.serif} italic ${WEIGHTS.light} text-text-secondary`,
  },
} as const

// Helper functions to get consistent font + color classes
export const getHeadingClass = () => 'font-serif font-bold text-text-primary'
export const getSubHeadingClass = () => 'font-serif font-semibold text-text-primary'
export const getBodyClass = () => 'font-sans font-normal text-text-secondary'
export const getLabelClass = () => 'font-sans font-medium text-text-primary'
export const getSubtextClass = () => 'font-serif italic font-light text-text-secondary'
export const getInputClass = () => 'text-text-primary placeholder:text-text-tertiary'

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
