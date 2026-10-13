import type { WithSpringConfig } from 'react-native-reanimated';

/** Durations in ms. Most transitions live between `fast` and `slow`. */
export const durations = {
  /** Button press-in: shadow collapse + scale. */
  press: 80,
  fast: 150,
  base: 250,
  slow: 400,
  /** Number count-up. Longer on purpose: it's the payoff moment. */
  countUp: 700,
  chartDraw: 900,
  shimmer: 1200,
} as const;

/** Per-item delay for staggered list entrances. */
export const stagger = 40;
/** Cap so long lists never take ages to appear. */
export const maxStaggerItems = 8;

/**
 * Springs are tuned to settle inside ~150–400ms. Physics-based (not duration)
 * so interrupted animations keep their velocity and never block input.
 */
export const springs = {
  /** Button release, toggles, small UI. */
  snappy: { damping: 18, stiffness: 420, mass: 0.7 },
  /** Cards, sheets, page elements entering. */
  standard: { damping: 20, stiffness: 260, mass: 0.9 },
  /** Mascot hops and celebratory bits. */
  bouncy: { damping: 11, stiffness: 240, mass: 0.8 },
  /** Slow drift, breathing. */
  gentle: { damping: 22, stiffness: 120, mass: 1 },
} satisfies Record<string, WithSpringConfig>;

export const pressScale = 0.96;
