import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { durations, maxStaggerItems, stagger, springs } from '../theme';
import { useReduceMotion } from './useMotion';

type Props = { index: number; children: ReactNode; style?: StyleProp<ViewStyle> };

/** Staggered list entrance: rise + fade, 40ms apart, capped so long lists don't drag. Fade only with Reduce Motion. */
export function StaggerIn({ index, children, style }: Props) {
  const reduceMotion = useReduceMotion();
  const delay = Math.min(index, maxStaggerItems) * stagger;
  const entering = reduceMotion
    ? FadeIn.duration(durations.base).delay(delay)
    : FadeInDown.springify().damping(springs.standard.damping).stiffness(springs.standard.stiffness).mass(springs.standard.mass).delay(delay);
  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}
