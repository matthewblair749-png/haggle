import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import { useReduceMotion } from '../motion/useMotion';
import { palette } from '../theme';

const COLORS = [palette.coral, palette.mint, palette.sunshine, palette.grape, palette.coralPressed];
const COUNT = 36;
const DURATION = 1500;

type Piece = { vx: number; vy: number; spin: number; color: string; w: number; h: number; round: boolean; sx: number; sy: number };

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makePieces(seed: number, width: number): Piece[] {
  const r = mulberry32(seed);
  return Array.from({ length: COUNT }, (_, i) => {
    const angle = -Math.PI / 2 + (r() - 0.5) * Math.PI * 0.9;
    const speed = 520 + r() * 520;
    return {
      vx: Math.cos(angle) * speed * 0.8,
      vy: Math.sin(angle) * speed,
      spin: (r() - 0.5) * 1440,
      color: COLORS[i % COLORS.length],
      w: 8 + r() * 6,
      h: 10 + r() * 8,
      round: r() > 0.6,
      // Static scatter for Reduce Motion.
      sx: (r() - 0.5) * width * 0.85,
      sy: -80 - r() * 260,
    };
  });
}

function PieceView({ piece, progress, reduceMotion }: { piece: Piece; progress: SharedValue<number>; reduceMotion: boolean }) {
  const style = useAnimatedStyle(() => {
    const p = progress.value;
    if (reduceMotion) {
      // Fade only: pieces appear in place, then fade away.
      const o = p < 0.2 ? p / 0.2 : p > 0.7 ? Math.max(0, (1 - p) / 0.3) : 1;
      return { opacity: o, transform: [{ translateX: piece.sx }, { translateY: piece.sy }] };
    }
    const t = (p * DURATION) / 1000;
    const g = 1500;
    return {
      opacity: p > 0.75 ? Math.max(0, (1 - p) / 0.25) : 1,
      transform: [
        { translateX: piece.vx * t },
        { translateY: piece.vy * t + 0.5 * g * t * t },
        { rotate: `${piece.spin * t}deg` },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        styles.piece,
        { width: piece.w, height: piece.round ? piece.w : piece.h, borderRadius: piece.round ? piece.w : 3, backgroundColor: piece.color },
        style,
      ]}
    />
  );
}

type Props = {
  /** Increment to fire a burst. 0 = idle. */
  trigger: number;
  /** Burst origin, as a fraction of the overlay's height. */
  originY?: number;
};

/**
 * Celebration confetti. Purely decorative: pointer-events none, hidden from
 * screen readers (announce the saving itself, not the confetti). One shared
 * progress value drives every piece on the UI thread.
 */
export function Confetti({ trigger, originY = 0.45 }: Props) {
  const reduceMotion = useReduceMotion();
  const { width } = useWindowDimensions();
  const progress = useSharedValue(0);
  // The burst for `trigger` is visible until its timer marks it finished.
  const [finished, setFinished] = useState(0);
  const active = trigger !== 0 && trigger !== finished;
  const pieces = useMemo(() => makePieces(trigger * 7919 + 1, width), [trigger, width]);

  useEffect(() => {
    if (!trigger) return;
    progress.value = 0;
    // We handle reduced motion ourselves (fade-only pieces), so the timing itself must always run.
    progress.value = withTiming(1, { duration: reduceMotion ? 1100 : DURATION, easing: Easing.linear, reduceMotion: ReduceMotion.Never });
    const id = setTimeout(() => setFinished(trigger), (reduceMotion ? 1100 : DURATION) + 50);
    return () => clearTimeout(id);
  }, [trigger, reduceMotion, progress]);

  if (!active) return null;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      <View style={[styles.origin, { top: `${originY * 100}%` }]}>
        {pieces.map((p, i) => (
          <PieceView key={i} piece={p} progress={progress} reduceMotion={reduceMotion} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  origin: { position: 'absolute', left: '50%', width: 0, height: 0 },
  piece: { position: 'absolute' },
});
