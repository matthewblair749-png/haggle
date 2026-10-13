import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useReduceMotion } from '../motion/useMotion';

function Dot({ index, color, reduceMotion }: { index: number; color: string; reduceMotion: boolean }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.value = withDelay(
      index * 120,
      // Always runs: with Reduce Motion the dots pulse opacity instead of bouncing.
      withRepeat(withSequence(withTiming(1, { duration: 260, reduceMotion: ReduceMotion.Never }), withTiming(0, { duration: 260, reduceMotion: ReduceMotion.Never })), -1),
    );
    return () => cancelAnimation(v);
  }, [index, v]);
  const style = useAnimatedStyle(() =>
    reduceMotion ? { opacity: 0.35 + 0.65 * v.value } : { transform: [{ translateY: -5 * v.value }] },
  );
  return <Animated.View style={[styles.dot, { backgroundColor: color }, style]} />;
}

/** In-button "working on it" indicator. Never a bare spinner. */
export function LoadingDots({ color }: { color: string }) {
  const reduceMotion = useReduceMotion();
  return (
    <View style={styles.row} accessibilityLabel="Loading" accessibilityRole="progressbar">
      {[0, 1, 2].map((i) => (
        <Dot key={i} index={i} color={color} reduceMotion={reduceMotion} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, height: 24, alignItems: 'center' },
  dot: { width: 9, height: 9, borderRadius: 5 },
});
