import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { feedback } from '../feedback/feedback';
import { useReduceMotion } from '../motion/useMotion';
import { colors, durations, minTapTarget, space, springs } from '../theme';
import { Icon, type IconName } from './Icon';
import { Text } from './Text';

type Props = {
  label: string;
  description?: string;
  icon?: IconName;
  value: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
};

const TRACK_W = 56;
const TRACK_H = 34;
const KNOB = 26;

/**
 * A settings switch. Whole row is the tap target. State is shown by knob
 * position, an on/off word, and a11y "switch" state, not by color alone.
 */
export function ToggleRow({ label, description, icon, value, onChange, disabled }: Props) {
  const reduceMotion = useReduceMotion();
  const v = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    v.value = reduceMotion ? withTiming(value ? 1 : 0, { duration: durations.fast }) : withSpring(value ? 1 : 0, springs.snappy);
  }, [value, reduceMotion, v]);

  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(v.value, [0, 1], [colors.creamPressed, colors.mint]),
  }));
  const knob = useAnimatedStyle(() => ({ transform: [{ translateX: v.value * (TRACK_W - KNOB - 8) }] }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled: !!disabled }}
      accessibilityLabel={label}
      accessibilityHint={description}
      disabled={disabled}
      onPress={() => {
        feedback('select');
        onChange(!value);
      }}
      style={[styles.row, disabled && styles.disabled]}
    >
      {icon ? (
        <View style={styles.iconWrap}>
          <Icon name={icon} size={22} />
        </View>
      ) : null}
      <View style={styles.copy}>
        <Text variant="bodyStrong">{label}</Text>
        {description ? (
          <Text variant="label" color={colors.textSecondary}>
            {description}
          </Text>
        ) : null}
      </View>
      <View style={styles.switchCol}>
        <Animated.View style={[styles.track, track]}>
          <Animated.View style={[styles.knob, knob]} />
        </Animated.View>
        <Text variant="caption" color={colors.textSecondary} importantForAccessibility="no">
          {value ? 'On' : 'Off'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: minTapTarget + 16, paddingVertical: space.xs },
  disabled: { opacity: 0.5 },
  iconWrap: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.sand, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 2 },
  switchCol: { alignItems: 'center', gap: 2 },
  track: { width: TRACK_W, height: TRACK_H, borderRadius: TRACK_H / 2, padding: 4, justifyContent: 'center' },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: colors.white,
    borderBottomWidth: 3,
    borderBottomColor: colors.creamPressed,
  },
});
