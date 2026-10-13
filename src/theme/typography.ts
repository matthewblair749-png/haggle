import type { TextStyle } from 'react-native';

export const fontFamilies = {
  headingSemi: 'Fredoka_600SemiBold',
  headingBold: 'Fredoka_700Bold',
  body: 'Nunito_500Medium',
  bodySemi: 'Nunito_700Bold',
  bodyBold: 'Nunito_800ExtraBold',
} as const;

type Variant = Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight' | 'letterSpacing'> & {
  /** Cap for Dynamic Type so big headings don't overflow; body text scales further. */
  maxScale: number;
  /** Treated as a header by screen readers. */
  header?: boolean;
};

/**
 * Type scale. Fredoka for headings and numbers, Nunito for body. Sizes are big
 * and friendly; body starts at 17 (iOS default) so nothing is squinty.
 */
export const typeScale = {
  display: { fontFamily: fontFamilies.headingBold, fontSize: 40, lineHeight: 46, letterSpacing: -0.5, maxScale: 1.4, header: true },
  h1: { fontFamily: fontFamilies.headingBold, fontSize: 32, lineHeight: 38, letterSpacing: -0.3, maxScale: 1.5, header: true },
  h2: { fontFamily: fontFamilies.headingSemi, fontSize: 25, lineHeight: 31, maxScale: 1.6, header: true },
  h3: { fontFamily: fontFamilies.headingSemi, fontSize: 20, lineHeight: 26, maxScale: 1.8, header: true },
  bodyLg: { fontFamily: fontFamilies.body, fontSize: 19, lineHeight: 27, maxScale: 2.2 },
  body: { fontFamily: fontFamilies.body, fontSize: 17, lineHeight: 24, maxScale: 2.4 },
  bodyStrong: { fontFamily: fontFamilies.bodyBold, fontSize: 17, lineHeight: 24, maxScale: 2.4 },
  label: { fontFamily: fontFamilies.bodySemi, fontSize: 15, lineHeight: 20, maxScale: 2.2 },
  caption: { fontFamily: fontFamilies.bodySemi, fontSize: 13, lineHeight: 18, letterSpacing: 0.2, maxScale: 2.2 },
  button: { fontFamily: fontFamilies.headingSemi, fontSize: 19, lineHeight: 24, maxScale: 1.8 },
  buttonSm: { fontFamily: fontFamilies.headingSemi, fontSize: 16, lineHeight: 20, maxScale: 1.8 },
  priceXl: { fontFamily: fontFamilies.headingBold, fontSize: 48, lineHeight: 54, letterSpacing: -1, maxScale: 1.4 },
  price: { fontFamily: fontFamilies.headingBold, fontSize: 30, lineHeight: 36, letterSpacing: -0.5, maxScale: 1.6 },
  priceSm: { fontFamily: fontFamilies.headingSemi, fontSize: 20, lineHeight: 24, maxScale: 1.8 },
} satisfies Record<string, Variant>;

export type TypeVariant = keyof typeof typeScale;
