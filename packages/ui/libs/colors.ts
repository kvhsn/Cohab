/**
 * Design token values accessible in JavaScript.
 * These mirror the CSS custom properties defined in global.css.
 * Use these when CSS variables are not accessible (RN style props, LinearGradient, etc.).
 */
export const colors = {
  // Brand (mirrors --color-primary, --color-secondary)
  primary: '#c084fc',
  secondary: '#60a5fa',

  // Feedback (mirrors --color-error, --color-warning, --color-info, --color-success)
  error: '#ef4444',
  errorDark: '#f87171', // red-400 — dark mode variant
  warning: '#eab308',
  info: '#3b82f6',
  success: '#22c55e',

  // Page backgrounds (mirrors --color-background-primary, --color-dark-surface)
  bgLight: '#e3fdfd',
  bgDark: '#0f172a',

  // Navigation header text
  headerLight: '#0f172a', // slate-900
  headerDark: '#f1f5f9', // slate-100

  // Input placeholder
  placeholderLight: '#9ca3af', // gray-400
  placeholderDark: '#6b7280', // gray-500

  // Text/icon on surfaces (for programmatic color prop — className unreliable on dynamic components)
  white: '#ffffff',
  textLight: '#111827', // gray-900 — dark text on light surfaces
  textDark: '#f3f4f6', // gray-100 — light text on dark surfaces

  // Misc
  crown: '#ca8a04', // yellow-600 — admin crown icon
} as const;
