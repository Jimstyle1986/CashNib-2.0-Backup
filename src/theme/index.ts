import { colors, darkColors, ColorScheme } from './colors';
import { typography, fontSizes, fontWeights, lineHeights } from './typography';
import { spacing, layout } from './spacing';

// Main theme object
export const theme = {
  colors,
  typography,
  spacing,
  layout,
  fontSizes,
  fontWeights,
  lineHeights,
};

// Dark theme object
export const darkTheme = {
  ...theme,
  colors: darkColors,
};

// Theme type
export type Theme = typeof theme;

// Common shadow styles
export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  base: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  md: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  lg: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  xl: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },
};

// Animation durations
export const animations = {
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
};

// Responsive breakpoints
export const breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

// Export all theme components
export { colors, darkColors, typography, spacing, layout };
export type { ColorScheme };

// Default export
export default theme;