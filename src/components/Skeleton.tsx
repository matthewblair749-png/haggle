import { useEffect, useState } from 'react';
import { StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { useReduceMotion } from '../motion/useMotion';
import { colors, durations, radii } from '../theme';

type Props = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

const BAND = 120;

/**
 * Shimmer placeholder. A soft highlight sweeps across; with Reduce Motion it
 * gently pulses opacity instead. Hidden from screen readers (the parent
 * container announces "Loading …").
 */
export function Skeleton({ width = '100%', height = 16, radius = radii.sm / 2, style }: Props) {
  const reduceMotion = useReduceMotion();
  const [w, setW] = useState(0);
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = 0;
    p.value = reduceMotion
      ? withRepeat(withSequence(withTiming(1, { duration: 700, reduceMotion: ReduceMotion.Never }), withTiming(0, { duration: 700, reduceMotion: ReduceMotion.Never })), -1)
      : withRepeat(withTiming(1, { duration: durations.shimmer, easing: Easing.inOut(Easing.quad) }), -1);
    return () => cancelAnimation(p);
  }, [reduceMotion, p]);

  const bandStyle = useAnimatedStyle(() =>
    reduceMotion ? { opacity: 0 } : { transform: [{ translateX: -BAND + (w + BAND * 2) * p.value }] },
  );
  const pulseStyle = useAnimatedStyle(() => ({ opacity: reduceMotion ? 0.55 + 0.45 * p.value : 1 }));

  return (
    <Animated.View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
      style={[styles.base, { width, height, borderRadius: radius }, pulseStyle, style]}
    >
      <Animated.View style={[styles.band, bandStyle]}>
        <Svg width={BAND} height="100%">
          <Defs>
            <LinearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
              <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.75" />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width={BAND} height="100%" fill="url(#shimmer)" />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}

/** Skeleton shaped like a store result card. */
export function ResultCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Skeleton width={56} height={56} radius={18} />
        <View style={styles.col}>
          <Skeleton width="60%" height={18} />
          <Skeleton width="35%" height={14} />
        </View>
      </View>
      <Skeleton width="45%" height={30} radius={12} />
      <View style={styles.row}>
        <Skeleton width={110} height={26} radius={13} />
        <Skeleton width={90} height={26} radius={13} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.sand, overflow: 'hidden' },
  band: { position: 'absolute', top: 0, bottom: 0, width: BAND },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 20,
    gap: 14,
    borderBottomWidth: 6,
    borderBottomColor: colors.creamPressed,
  },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  col: { flex: 1, gap: 8 },
});
