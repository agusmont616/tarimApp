/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

// La app siempre usa el tema oscuro (fondo gris muy oscuro), sin importar
// el esquema de color del sistema operativo. Por eso 'light' y 'dark'
// comparten los mismos valores.
const TEMA_OSCURO = {
  text: '#ffffff',
  background: '#121212',
  backgroundElement: '#212225',
  backgroundSelected: '#2E3135',
  textSecondary: '#B0B4BA',
} as const;

export const Colors = {
  light: TEMA_OSCURO,
  dark: TEMA_OSCURO,
} as const;

// Colores de marca de la aplicación: negro como principal, naranja como secundario.
export const BrandColors = {
  primary: '#000000',
  secondary: '#FF7A00',
  secondaryLight: '#FFD9B3',
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
