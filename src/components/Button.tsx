import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { FeedbackMeaning } from '../feedback/feedback';
import { colors, depth, radii, space, tones, type Tone } from '../theme';
import { Icon, type IconName } from './Icon';
import { LoadingDots } from './LoadingDots';
import { PressableSurface } from './PressableSurface';
import { Text } from './Text';

type Size = 'lg' | 'md' | 'sm';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  tone?: Tone;
  size?: Size;
  icon?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  /** Shows bouncing dots in place of the label; the button stays pressable-looking but inert. */
  loading?: boolean;
  fullWidth?: boolean;
  haptic?: FeedbackMeaning | 'none';
  accessibilityHint?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const sizes: Record<Size, { height: number; padX: number; radius: number; depth: number; icon: number }> = {
  lg: { height: 60, padX: space.xl, radius: radii.md, depth: depth.md, icon: 24 },
  md: { height: 52, padX: space.lg, radius: radii.sm, depth: depth.md, icon: 22 },
  sm: { height: 44, padX: space.md, radius: radii.sm, depth: depth.sm, icon: 18 },
};

export function Button({
  label,
  onPress,
  tone = 'coral',
  size = 'lg',
  icon,
  iconRight,
  disabled,
  loading,
  fullWidth,
  haptic,
  accessibilityHint,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const s = sizes[size];
  const t = tones[tone];
  const inert = disabled || loading;
  const labelColor = disabled ? colors.inkSoft : t.label;

  return (
    <PressableSurface
      tone={tone}
      fill={disabled ? colors.sand : undefined}
      edge={disabled ? colors.creamPressed : undefined}
      radius={s.radius}
      depth={s.depth}
      disabled={inert}
      haptic={haptic}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      style={[fullWidth ? styles.full : styles.hug, style]}
      contentStyle={[styles.face, { minHeight: s.height - s.depth, paddingHorizontal: s.padX }]}
    >
      {loading ? (
        <LoadingDots color={labelColor} />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={s.icon} color={labelColor} /> : null}
          <Text variant={size === 'sm' ? 'buttonSm' : 'button'} color={labelColor} numberOfLines={2} align="center">
            {label}
          </Text>
          {iconRight ? <Icon name={iconRight} size={s.icon} color={labelColor} /> : null}
        </View>
      )}
    </PressableSurface>
  );
}

const styles = StyleSheet.create({
  full: { alignSelf: 'stretch' },
  hug: { alignSelf: 'flex-start' },
  face: { alignItems: 'center', justifyContent: 'center', paddingVertical: space.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.xs, flexShrink: 1 },
});
