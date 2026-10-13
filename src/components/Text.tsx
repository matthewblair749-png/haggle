import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { colors, typeScale, type TypeVariant } from '../theme';

export type TextProps = RNTextProps & {
  variant?: TypeVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
};

/**
 * The only text primitive. Applies the type scale, scales with Dynamic Type
 * (capped per variant), and marks headings for screen readers.
 */
export function Text({ variant = 'body', color = colors.text, align, style, ...rest }: TextProps) {
  const { maxScale, header, ...type } = typeScale[variant] as (typeof typeScale)[TypeVariant] & {
    header?: boolean;
  };
  return (
    <RNText
      accessibilityRole={header ? 'header' : undefined}
      maxFontSizeMultiplier={maxScale}
      style={[type, { color, textAlign: align }, style]}
      {...rest}
    />
  );
}
