/**
 * Centralized Font & Color System for ALIRA
 * 
 * This file defines all font styles and text colors used across the entire application.
 * Use these utility functions instead of inline Tailwind classes to ensure consistency.
 */

// Font Family Constants
export const FONTS = {
  serif: 'font-serif', // Playfair Display - for headings
  sans: 'font-sans',   // Lato - for body text
} as const

// Font Weight Constants
export const WEIGHTS = {
  light: 'font-light',
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
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
  // Main section headings (H1, H2)
  heading: {
    main: `${FONTS.serif} ${WEIGHTS.bold} ${TEXT_COLORS.primary}`,
    sub: `${FONTS.serif} ${WEIGHTS.semibold} ${TEXT_COLORS.primary}`,
  },
  
  // Body text
  body: {
    regular: `${FONTS.sans} ${TEXT_COLORS.secondary}`,
    muted: `${FONTS.sans} ${TEXT_COLORS.tertiary}`,
  },
  
  // Labels, badges, small text
  label: {
    main: `${FONTS.sans} ${WEIGHTS.medium} ${TEXT_COLORS.primary}`,
    muted: `${FONTS.sans} ${WEIGHTS.medium} ${TEXT_COLORS.tertiary}`,
  },
  
  // Special: Italic serif for subtext
  subtext: {
    main: `${FONTS.serif} italic ${WEIGHTS.light} ${TEXT_COLORS.secondary}`,
  },
} as const

// Helper functions to get consistent font + color classes
export const getHeadingClass = () => 'font-serif font-bold text-alira-onyx dark:text-alira-porcelain'
export const getSubHeadingClass = () => 'font-serif font-semibold text-alira-onyx dark:text-alira-porcelain'
export const getBodyClass = () => 'font-sans text-alira-onyx/80 dark:text-alira-porcelain/80'
export const getLabelClass = () => 'font-sans font-medium text-alira-onyx dark:text-alira-porcelain'
export const getSubtextClass = () => 'font-serif italic font-light text-alira-onyx/80 dark:text-alira-porcelain/80'
export const getInputClass = () => 'text-alira-onyx dark:text-alira-porcelain placeholder:text-alira-onyx/40 dark:placeholder:text-alira-porcelain/40'

// CSS-in-JS styles (for non-Tailwind usage)
export const fontStyles = {
  heading: {
    fontFamily: '"Playfair Display", "Times New Roman", serif',
    fontWeight: 700,
  },
  subHeading: {
    fontFamily: '"Playfair Display", "Times New Roman", serif',
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
    fontFamily: '"Playfair Display", "Times New Roman", serif',
    fontWeight: 300,
    fontStyle: 'italic',
  },
} as const

export default typography
