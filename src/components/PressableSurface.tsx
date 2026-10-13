import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { feedback, type FeedbackMeaning } from '../feedback/feedback';
import { useReduceMotion } from '../motion/useMotion';
import { depth as depthTokens, durations, minTapTarget, pressScale, radii, springs, tones, type Tone } from '../theme';

export type PressableSurfaceProps = Omit<PressableProps, 'style' | 'children'> & {
  tone?: Tone;
  /** Override fill/edge, e.g. a disabled look. */
  fill?: string;
  edge?: string;
  radius?: number;
  depth?: number;
  /** Feedback fired on press. Defaults to a light "select" tap. */
  haptic?: FeedbackMeaning | 'none';
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

/**
 * The chunky, pressable base for buttons and cards. A darker "edge" sits under
 * the face. On press-in the face drops onto the edge and scales to 0.96 in
 * 80ms; on release it springs back. Animations run on the UI thread and never
 * gate input: `onPress` fires normally, mid-animation or not.
 */
export function PressableSurface({
  tone = 'surface',
  fill,
  edge,
  radius = radii.md,
  depth = depthTokens.md,
  haptic = 'select',
  disabled,
  style,
  contentStyle,
  onPressIn,
  onPressOut,
  onPress,
  children,
  ...rest
}: PressableSurfaceProps) {
  const reduceMotion = useReduceMotion();
  const pressed = useSharedValue(0);
  const t = tones[tone];
  const faceColor = fill ?? t.fill;
  const edgeColor = edge ?? t.edge;

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: reduceMotion ? 1 : 1 - (1 - pressScale) * pressed.value }],
  }));
  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: depth * pressed.value }],
    opacity: reduceMotion ? 1 - 0.15 * pressed.value : 1,
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={[styles.hit, style]}
      onPressIn={(e) => {
        pressed.value = withTiming(1, { duration: durations.press });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        pressed.value = withSpring(0, springs.snappy);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic !== 'none') feedback(haptic);
        onPress?.(e);
      }}
      {...rest}
    >
      <Animated.View style={scaleStyle}>
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { top: depth, borderRadius: radius, backgroundColor: edgeColor }]}
        />
        <Animated.View
          style={[{ marginBottom: depth, borderRadius: radius, backgroundColor: faceColor }, contentStyle, faceStyle]}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hit: { minHeight: minTapTarget },
});
