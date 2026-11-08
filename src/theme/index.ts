
export const colors = {
  primary: '#2E7D5B', 
  primaryLight: '#E3F2EA',
  secondary: '#F29E4C',
  background: '#F7F8F6',
  surface: '#FFFFFF',
  text: '#1C1F1D',
  textMuted: '#6B726E',
  border: '#E1E5E2',
  danger: '#C8423B',
  dangerLight: '#FBEAE9',
  white: '#FFFFFF',
  protein: '#4C7DF2',
  carbs: '#F2B84C',
  fat: '#D9667B',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

export const fontSize = {
  caption: 12,
  body: 15,
  subtitle: 17,
  title: 22,
  display: 32,
} as const;

export const theme = { colors, spacing, radius, fontSize };
export type Theme = typeof theme;
