/**
 * Haggle color tokens.
 *
 * Every brand color has a `pressed` shade used for the thick bottom-edge shadow
 * under pressable surfaces. Brand colors are fills; when an accent is needed as
 * *text* on a light background, use the matching `*Text` token, which passes
 * WCAG AA (4.5:1) on cream and white. See `contrast.test.ts`.
 */
export const palette = {
  coral: '#FF8A3D',
  coralPressed: '#D9671F',
  coralText: '#B8480F',
  coralTint: '#FFE9D9',

  mint: '#19C3B1',
  mintPressed: '#0E9787',
  mintText: '#0A7A70',
  mintTint: '#D6F5F1',

  sunshine: '#FFD23F',
  sunshinePressed: '#D9A91A',
  sunshineText: '#8A6A00',
  sunshineTint: '#FFF4CC',

  grape: '#7C5CFF',
  grapePressed: '#5B3FD9',
  grapeText: '#6244E0',
  grapeTint: '#ECE6FF',

  ink: '#1D1D2B',
  inkPressed: '#07070F',
  inkSoft: '#5A5A6E',
  inkMuted: '#6E6A7C',

  cream: '#FFFBF2',
  creamPressed: '#EADDC2',
  sand: '#F5EBD6',
  white: '#FFFFFF',

  danger: '#B3261E',
  dangerTint: '#FDE3E1',
} as const;

/** Semantic aliases. Components should prefer these over raw palette values. */
export const colors = {
  ...palette,
  background: palette.cream,
  surface: palette.white,
  surfacePressed: palette.creamPressed,
  surfaceSunken: palette.sand,
  text: palette.ink,
  textSecondary: palette.inkSoft,
  textMuted: palette.inkMuted,
  textOnBrand: palette.ink,
  textOnInk: palette.white,
  focusRing: palette.grape,
  priceDown: palette.mintText,
  priceUp: palette.danger,
} as const;

export type ColorName = keyof typeof colors;

/** Fill + pressed-shadow + readable label for each pressable tone. */
export const tones = {
  coral: { fill: palette.coral, edge: palette.coralPressed, label: palette.ink, tint: palette.coralTint, text: palette.coralText },
  mint: { fill: palette.mint, edge: palette.mintPressed, label: palette.ink, tint: palette.mintTint, text: palette.mintText },
  sunshine: { fill: palette.sunshine, edge: palette.sunshinePressed, label: palette.ink, tint: palette.sunshineTint, text: palette.sunshineText },
  grape: { fill: palette.grapeText, edge: palette.grapePressed, label: palette.white, tint: palette.grapeTint, text: palette.grapeText },
  ink: { fill: palette.ink, edge: palette.inkPressed, label: palette.white, tint: palette.sand, text: palette.ink },
  surface: { fill: palette.white, edge: palette.creamPressed, label: palette.ink, tint: palette.sand, text: palette.ink },
} as const;

export type Tone = keyof typeof tones;
