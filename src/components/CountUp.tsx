import { useEffect, useRef, useState } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

import { useReduceMotion } from '../motion/useMotion';
import { durations, type TypeVariant } from '../theme';
import { formatCents, spokenCents, type Cents } from '../utils/money';
import { Text } from './Text';

type Props = {
  cents: Cents;
  /** Animate from this value. Defaults to the previously shown value (or 0). */
  from?: Cents;
  variant?: TypeVariant;
  color?: string;
  whole?: boolean;
  duration?: number;
  onDone?: () => void;
};

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Money that counts up. Driven on the JS thread with rAF: it re-renders one
 * Text for ~0.7s, which is cheap and works the same on every platform.
 * Screen readers always hear the final value, never the intermediate ones.
 * With Reduce Motion the final value fades in.
 */
export function CountUp({ cents, from, variant = 'price', color, whole, duration = durations.countUp, onDone }: Props) {
  const reduceMotion = useReduceMotion();
  const last = useRef<Cents>(from ?? 0);
  const [shown, setShown] = useState<Cents>(reduceMotion ? cents : (from ?? 0));
  const [fadeKey, setFadeKey] = useState(0);

  useEffect(() => {
    const start = from ?? last.current;
    last.current = cents;
    if (reduceMotion || start === cents) {
      setShown(cents);
      setFadeKey((k) => k + 1);
      onDone?.();
      return;
    }
    let raf = 0;
    const t0 = Date.now();
    const tick = () => {
      const t = Math.min(1, (Date.now() - t0) / duration);
      setShown(Math.round(start + (cents - start) * easeOutCubic(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else onDone?.();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cents, reduceMotion]);

  return (
    <Animated.View key={fadeKey} entering={reduceMotion ? FadeIn.duration(durations.base) : undefined}>
      <Text
        variant={variant}
        color={color}
        accessibilityLabel={spokenCents(cents)}
        style={{ fontVariant: ['tabular-nums'] }}
      >
        {formatCents(shown, { whole })}
      </Text>
    </Animated.View>
  );
}
