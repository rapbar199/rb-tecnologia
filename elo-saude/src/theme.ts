// Resolve para hooks/use-color-scheme.web.ts na web (onde o valor precisa ser
// recalculado depois da hidratação) e para o hook do react-native no nativo.
import { useColorScheme } from './hooks/use-color-scheme';

/**
 * Tokens de cor. Os valores categóricos e de status vêm de uma paleta validada
 * para daltonismo (protan/deutan/tritan) e contraste contra as superfícies
 * abaixo. Os badges de fonte sempre carregam o nome em texto — a cor nunca é o
 * único canal de identidade.
 */
const light = {
  mode: 'light' as const,
  page: '#f4f6fa',
  surface: '#ffffff',
  surfaceAlt: '#eef2f8',
  border: 'rgba(11,11,11,0.10)',
  grid: '#e1e0d9',
  axis: '#c3c2b7',

  text: '#0b0b0b',
  textSecondary: '#52514e',
  textMuted: '#898781',
  onBrand: '#ffffff',

  brand: '#2a78d6',
  brandSoft: '#e8f1fc',

  good: '#0ca30c',
  warning: '#fab219',
  serious: '#ec835a',
  critical: '#d03b3b',
  goodText: '#006300',

  series: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300'],
  bandFill: 'rgba(42,120,214,0.10)',
};

const dark: typeof light = {
  mode: 'dark' as unknown as 'light',
  page: '#0b0f16',
  surface: '#161d28',
  surfaceAlt: '#1e2734',
  border: 'rgba(255,255,255,0.10)',
  grid: '#2c2c2a',
  axis: '#383835',

  text: '#ffffff',
  textSecondary: '#c3c2b7',
  textMuted: '#898781',
  onBrand: '#ffffff',

  brand: '#3987e5',
  brandSoft: '#16263c',

  good: '#0ca30c',
  warning: '#fab219',
  serious: '#ec835a',
  critical: '#d03b3b',
  goodText: '#0ca30c',

  series: ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300'],
  bandFill: 'rgba(57,135,229,0.14)',
};

export type Theme = typeof light;

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? dark : light;
}

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 };

export const font = {
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.4 },
  h2: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.2 },
  h3: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  small: { fontSize: 13, fontWeight: '400' as const },
  tiny: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.3 },
  mono: { fontSize: 15, fontWeight: '600' as const, fontVariant: ['tabular-nums' as const] },
};
