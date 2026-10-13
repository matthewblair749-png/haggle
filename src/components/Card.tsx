import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { FeedbackMeaning } from '../feedback/feedback';
import { colors, depth as depthTokens, radii, space, tones, type Tone } from '../theme';
import { PressableSurface } from './PressableSurface';

type Props = {
  children: ReactNode;
  tone?: Tone;
  /** When set, the card is pressable and gets the press-down behavior. */
  onPress?: () => void;
  haptic?: FeedbackMeaning | 'none';
  padding?: number;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

/** A chunky card with a thick bottom edge. Pressable when given `onPress`. */
export function Card({
  children,
  tone = 'surface',
  onPress,
  haptic,
  padding = space.lg,
  accessibilityLabel,
  accessibilityHint,
  style,
  contentStyle,
}: Props) {
  if (onPress) {
    return (
      <PressableSurface
        tone={tone}
        radius={radii.lg}
        depth={depthTokens.md}
        onPress={onPress}
        haptic={haptic}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        style={style}
        contentStyle={[{ padding }, contentStyle]}
      >
        {children}
      </PressableSurface>
    );
  }
  const t = tones[tone];
  return (
    <View style={[styles.static, { backgroundColor: t.edge, paddingBottom: depthTokens.md }, style]}>
      <View
        accessible={!!accessibilityLabel}
        accessibilityLabel={accessibilityLabel}
        style={[styles.face, { backgroundColor: t.fill, padding }, contentStyle]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  static: { borderRadius: radii.lg },
  face: { borderRadius: radii.lg, backgroundColor: colors.surface },
});
