/**
 * KaamMitra design tokens.
 *
 * India-first, warm and trustworthy. One strong accent (saffron/terracotta),
 * a warm neutral background, large radii and generous spacing for big touch
 * targets on budget devices. No gradients, no flashy effects.
 */

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  card: string;
  border: string;
  text: string;
  textMuted: string;
  textInverse: string;
  primary: string;
  primaryDark: string;
  primarySoft: string;
  accent: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  info: string;
  infoSoft: string;
  tabBar: string;
  tabInactive: string;
}

export interface Theme {
  dark: boolean;
  colors: ThemeColors;
  spacing: (n: number) => number;
  radius: { sm: number; md: number; lg: number; xl: number; pill: number };
  font: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    display: number;
  };
}

const spacing = (n: number) => n * 8;

const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 };

const font = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34,
};

export const lightTheme: Theme = {
  dark: false,
  spacing,
  radius,
  font,
  colors: {
    background: '#FBF7F0',
    surface: '#FFFFFF',
    surfaceAlt: '#F3ECE0',
    card: '#FFFFFF',
    border: '#ECE3D5',
    text: '#241E17',
    textMuted: '#7A6F61',
    textInverse: '#FFFFFF',
    primary: '#E2640D',
    primaryDark: '#B84F06',
    primarySoft: '#FCE9D8',
    accent: '#0E7C66',
    success: '#1F9D55',
    successSoft: '#DDF3E4',
    warning: '#C98A00',
    warningSoft: '#FBEFCF',
    danger: '#C0392B',
    dangerSoft: '#F8E0DC',
    info: '#2A6FB0',
    infoSoft: '#DCEAF7',
    tabBar: '#FFFFFF',
    tabInactive: '#9C9081',
  },
};

export const darkTheme: Theme = {
  dark: true,
  spacing,
  radius,
  font,
  colors: {
    background: '#15110D',
    surface: '#211B15',
    surfaceAlt: '#2B231B',
    card: '#231C15',
    border: '#3A2F24',
    text: '#F4EDE2',
    textMuted: '#B3A593',
    textInverse: '#1A140E',
    primary: '#F1843B',
    primaryDark: '#D2691E',
    primarySoft: '#3A2A1A',
    accent: '#34B79B',
    success: '#41C079',
    successSoft: '#1E3326',
    warning: '#E0A93B',
    warningSoft: '#352A14',
    danger: '#E07061',
    dangerSoft: '#3A211D',
    info: '#5FA0DA',
    infoSoft: '#1B2A3A',
    tabBar: '#1B1610',
    tabInactive: '#7E7264',
  },
};
