import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { useReduceMotion } from '../../motion/useMotion';
import { durations, palette, springs } from '../../theme';
import { moodDescription, type MascotMood, type MascotProps } from './types';

/*
 * Placeholder llama ("Haggle"), drawn on a 200×200 grid as stacked SVG layers.
 * Each moving part (whole body, head, each ear, eyes) is its own Animated.View
 * so transforms run on the UI thread and behave the same on iOS, Android and web.
 */

const fur = '#F6DDB8';
const furShade = '#E8C391';
const fleece = '#FFF6E6';
const snout = '#FFF0DB';
const ink = palette.ink;
const OUTLINE = 5;

const line = { stroke: ink, strokeWidth: OUTLINE, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

type Pose = { earL: number; earR: number; tilt: number; sink: number };

const poses: Record<MascotMood, Pose> = {
  idle: { earL: 0, earR: 0, tilt: 0, sink: 0 },
  thinking: { earL: -8, earR: 14, tilt: -7, sink: 0 },
  happy: { earL: -6, earR: 6, tilt: 0, sink: 0 },
  wink: { earL: -4, earR: 10, tilt: 5, sink: 0 },
  excited: { earL: -14, earR: 14, tilt: 0, sink: 0 },
  sad: { earL: -55, earR: 55, tilt: 0, sink: 7 },
  celebrating: { earL: -18, earR: 18, tilt: 0, sink: 0 },
  sleeping: { earL: -40, earR: 40, tilt: 8, sink: 4 },
};

const blinks: Record<MascotMood, boolean> = {
  idle: true,
  thinking: true,
  happy: true,
  wink: false,
  excited: true,
  sad: true,
  celebrating: false,
  sleeping: false,
};

function Layer({ children }: { children: React.ReactNode }) {
  return (
    <Svg viewBox="0 0 200 200" style={StyleSheet.absoluteFill}>
      {children}
    </Svg>
  );
}

const BodyArt = memo(function BodyArt() {
  return (
    <Layer>
      {/* body */}
      <Path d="M42 198 C42 164 68 150 100 150 C132 150 158 164 158 198 Z" fill={fleece} {...line} />
      {/* neck */}
      <Rect x={77} y={96} width={46} height={70} rx={20} fill={fur} {...line} />
      {/* scarf + tail */}
      <Path d="M116 132 L128 162 L112 160 Z" fill={palette.coralPressed} {...line} />
      <Rect x={70} y={120} width={60} height={18} rx={9} fill={palette.coral} {...line} />
      {/* price-tag charm */}
      <G transform="rotate(-12 100 152)">
        <Path d="M90 142 L110 142 L110 162 L100 170 L90 162 Z" fill={palette.sunshine} {...line} />
        <Circle cx={100} cy={150} r={2.6} fill={ink} />
      </G>
    </Layer>
  );
});

function Ear({ side }: { side: 'left' | 'right' }) {
  const d =
    side === 'left'
      ? 'M66 58 C54 34 58 14 70 8 C82 14 86 34 82 58 Z'
      : 'M134 58 C146 34 142 14 130 8 C118 14 114 34 118 58 Z';
  const inner =
    side === 'left' ? 'M70 50 C64 36 65 24 71 18 C77 24 78 36 77 50 Z' : 'M130 50 C136 36 135 24 129 18 C123 24 122 36 123 50 Z';
  return (
    <Layer>
      <Path d={d} fill={fur} {...line} />
      <Path d={inner} fill={palette.coralTint} />
    </Layer>
  );
}

const HeadArt = memo(function HeadArt({ hat }: { hat: boolean }) {
  return (
    <Layer>
      <Rect x={52} y={44} width={96} height={76} rx={38} fill={fur} {...line} />
      <Ellipse cx={100} cy={104} rx={30} ry={18} fill={snout} {...line} />
      {!hat ? (
        <G>
          <Circle cx={86} cy={46} r={11} fill={fleece} {...line} />
          <Circle cx={114} cy={46} r={11} fill={fleece} {...line} />
          <Circle cx={100} cy={40} r={13} fill={fleece} {...line} />
        </G>
      ) : null}
      <Ellipse cx={68} cy={96} rx={8} ry={5} fill={palette.coral} opacity={0.45} />
      <Ellipse cx={132} cy={96} rx={8} ry={5} fill={palette.coral} opacity={0.45} />
      <Ellipse cx={93} cy={99} rx={2.6} ry={2} fill={ink} />
      <Ellipse cx={107} cy={99} rx={2.6} ry={2} fill={ink} />
      <Path d="M58 72 Q60 60 70 56" stroke={furShade} strokeWidth={4} strokeLinecap="round" fill="none" />
    </Layer>
  );
});

function OpenEye({ cx, cy, big, lookUp }: { cx: number; cy: number; big?: boolean; lookUp?: boolean }) {
  const ry = big ? 11 : 9;
  return (
    <G>
      <Ellipse cx={cx} cy={cy} rx={big ? 8.5 : 7} ry={ry} fill={ink} />
      <Circle cx={cx + (lookUp ? 3 : 2)} cy={cy - (lookUp ? 5 : 3)} r={big ? 3.4 : 2.6} fill="#fff" />
    </G>
  );
}

const ClosedHappy = ({ cx, cy }: { cx: number; cy: number }) => (
  <Path d={`M${cx - 8} ${cy + 3} Q${cx} ${cy - 8} ${cx + 8} ${cy + 3}`} fill="none" {...line} strokeWidth={4.5} />
);
const ClosedSleep = ({ cx, cy }: { cx: number; cy: number }) => (
  <Path d={`M${cx - 8} ${cy - 1} Q${cx} ${cy + 6} ${cx + 8} ${cy - 1}`} fill="none" {...line} strokeWidth={4.5} />
);

function Eyes({ mood }: { mood: MascotMood }) {
  const L = { cx: 80, cy: 80 };
  const R = { cx: 120, cy: 80 };
  switch (mood) {
    case 'celebrating':
      return (
        <Layer>
          <ClosedHappy {...L} />
          <ClosedHappy {...R} />
        </Layer>
      );
    case 'sleeping':
      return (
        <Layer>
          <ClosedSleep {...L} />
          <ClosedSleep {...R} />
        </Layer>
      );
    case 'wink':
      return (
        <Layer>
          <OpenEye {...L} />
          <ClosedHappy {...R} />
        </Layer>
      );
    default:
      return (
        <Layer>
          <OpenEye {...L} big={mood === 'excited'} lookUp={mood === 'thinking'} />
          <OpenEye {...R} big={mood === 'excited'} lookUp={mood === 'thinking'} />
        </Layer>
      );
  }
}

function Mouth({ mood }: { mood: MascotMood }) {
  switch (mood) {
    case 'excited':
    case 'celebrating':
      return (
        <Layer>
          <Path d="M86 107 Q100 130 114 107 Z" fill={ink} {...line} strokeWidth={4} />
          <Ellipse cx={100} cy={116} rx={6} ry={3.5} fill={palette.coral} />
        </Layer>
      );
    case 'happy':
    case 'wink':
      return (
        <Layer>
          <Path d="M87 107 Q100 121 113 107" fill="none" {...line} strokeWidth={4.5} />
        </Layer>
      );
    case 'sad':
      return (
        <Layer>
          <Path d="M90 114 Q100 105 110 114" fill="none" {...line} strokeWidth={4.5} />
          <Path d="M70 68 Q78 66 86 61" fill="none" {...line} strokeWidth={4.5} />
          <Path d="M130 68 Q122 66 114 61" fill="none" {...line} strokeWidth={4.5} />
        </Layer>
      );
    case 'thinking':
      return (
        <Layer>
          <Path d="M94 111 Q102 108 109 110" fill="none" {...line} strokeWidth={4.5} />
          <Path d="M112 64 Q120 58 128 64" fill="none" {...line} strokeWidth={4.5} />
        </Layer>
      );
    case 'sleeping':
      return (
        <Layer>
          <Ellipse cx={100} cy={111} rx={4} ry={3} fill={ink} />
        </Layer>
      );
    default:
      return (
        <Layer>
          <Path d="M90 108 Q100 116 110 108" fill="none" {...line} strokeWidth={4.5} />
        </Layer>
      );
  }
}

function PartyHat() {
  return (
    <Layer>
      <Path d="M82 48 L100 4 L118 48 Z" fill={palette.grape} {...line} />
      <Circle cx={96} cy={30} r={3.5} fill={palette.sunshine} />
      <Circle cx={106} cy={40} r={3.5} fill={palette.mint} />
      <Circle cx={100} cy={5} r={7} fill={palette.sunshine} {...line} strokeWidth={4} />
    </Layer>
  );
}

function Sparkle({ x, y, s, color }: { x: number; y: number; s: number; color: string }) {
  const d = `M${x} ${y - s} Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s} Z`;
  return <Path d={d} fill={color} {...line} strokeWidth={3.5} />;
}

/** Looping overlay bits: thought dots, Zzz, sparkles. */
function Overlay({ mood, reduceMotion }: { mood: MascotMood; reduceMotion: boolean }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = 0;
    if (!reduceMotion) {
      t.value = withRepeat(withTiming(1, { duration: mood === 'sleeping' ? 2400 : 1100, easing: Easing.linear }), -1);
    }
    return () => cancelAnimation(t);
  }, [mood, reduceMotion, t]);

  const floatStyle = useAnimatedStyle(() => {
    if (reduceMotion) return { opacity: 1 };
    if (mood === 'sleeping') {
      return { opacity: Math.sin(t.value * Math.PI), transform: [{ translateY: -14 * t.value }, { translateX: 6 * t.value }] };
    }
    const s = 1 + 0.12 * Math.sin(t.value * Math.PI * 2);
    return { opacity: 1, transform: [{ scale: s }] };
  });

  if (mood === 'thinking') {
    return <ThinkingDots reduceMotion={reduceMotion} />;
  }
  let art: React.ReactNode = null;
  if (mood === 'sleeping') {
    art = (
      <Layer>
        <Path d="M146 48 h14 l-14 14 h14" fill="none" {...line} strokeWidth={4.5} />
        <Path d="M166 26 h10 l-10 10 h10" fill="none" {...line} strokeWidth={4} />
      </Layer>
    );
  } else if (mood === 'wink' || mood === 'excited' || mood === 'celebrating') {
    art = (
      <Layer>
        <Sparkle x={162} y={56} s={13} color={palette.sunshine} />
        <Sparkle x={36} y={70} s={9} color={palette.mint} />
        {mood !== 'wink' ? <Sparkle x={170} y={110} s={8} color={palette.coral} /> : null}
      </Layer>
    );
  }
  if (!art) return null;
  return (
    <Animated.View style={StyleSheet.absoluteFill} entering={FadeIn.duration(durations.fast)}>
      <Animated.View style={[StyleSheet.absoluteFill, floatStyle, { transformOrigin: '80% 30%' }]}>{art}</Animated.View>
    </Animated.View>
  );
}

function Dot({ i, t, reduceMotion }: { i: number; t: SharedValue<number>; reduceMotion: boolean }) {
  const pos = [
    { x: 148, y: 46, r: 5 },
    { x: 160, y: 30, r: 7 },
    { x: 176, y: 14, r: 9 },
  ][i];
  const style = useAnimatedStyle(() => {
    const phase = (t.value + i * 0.22) % 1;
    const k = Math.max(0, Math.sin(phase * Math.PI * 2));
    return reduceMotion ? { opacity: 1 } : { opacity: 0.55 + 0.45 * k, transform: [{ translateY: -4 * k }] };
  });
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <Layer>
        <Circle cx={pos.x} cy={pos.y} r={pos.r} fill={palette.grape} {...line} strokeWidth={3.5} />
      </Layer>
    </Animated.View>
  );
}

function ThinkingDots({ reduceMotion }: { reduceMotion: boolean }) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (!reduceMotion) t.value = withRepeat(withTiming(1, { duration: 1000, easing: Easing.linear }), -1);
    return () => cancelAnimation(t);
  }, [reduceMotion, t]);
  return (
    <Animated.View style={StyleSheet.absoluteFill} entering={FadeIn.duration(durations.fast)}>
      {[0, 1, 2].map((i) => (
        <Dot key={i} i={i} t={t} reduceMotion={reduceMotion} />
      ))}
    </Animated.View>
  );
}

export function MascotPlaceholder({ mood, size = 160, decorative, accessibilityLabel }: MascotProps) {
  const reduceMotion = useReduceMotion();
  const pose = poses[mood];

  // Pose (springs toward the mood's resting pose)
  const earL = useSharedValue(pose.earL);
  const earR = useSharedValue(pose.earR);
  const tilt = useSharedValue(pose.tilt);
  const sink = useSharedValue(pose.sink);
  // Loops
  const hop = useSharedValue(0);
  const wobble = useSharedValue(0);
  const breathe = useSharedValue(0);
  const blink = useSharedValue(1);
  const wiggle = useSharedValue(0);

  useEffect(() => {
    const to = (sv: SharedValue<number>, v: number) => {
      sv.value = reduceMotion ? v : withSpring(v, springs.standard);
    };
    to(earL, pose.earL);
    to(earR, pose.earR);
    to(tilt, pose.tilt);
    to(sink, pose.sink);

    [hop, wobble, breathe, wiggle].forEach(cancelAnimation);
    hop.value = 0;
    wobble.value = 0;
    breathe.value = 0;
    wiggle.value = 0;
    if (reduceMotion) return;

    if (mood === 'excited') {
      hop.value = withRepeat(withSequence(withTiming(-12, { duration: 160, easing: Easing.out(Easing.quad) }), withTiming(0, { duration: 180, easing: Easing.in(Easing.quad) }), withDelay(260, withTiming(0, { duration: 0 }))), -1);
    } else if (mood === 'celebrating') {
      hop.value = withRepeat(withSequence(withTiming(-20, { duration: 200, easing: Easing.out(Easing.quad) }), withTiming(0, { duration: 220, easing: Easing.in(Easing.quad) })), -1);
      wobble.value = withRepeat(withSequence(withTiming(-7, { duration: 210 }), withTiming(7, { duration: 210 })), -1, true);
    } else if (mood === 'happy' || mood === 'wink') {
      // One friendly hop on arrival, then settle into breathing.
      hop.value = withSequence(withTiming(-10, { duration: 140, easing: Easing.out(Easing.quad) }), withSpring(0, springs.bouncy));
    }

    const breatheMs = mood === 'sleeping' ? 2600 : 1800;
    breathe.value = withRepeat(withTiming(1, { duration: breatheMs, easing: Easing.inOut(Easing.sin) }), -1, true);

    if (mood === 'idle' || mood === 'happy') {
      wiggle.value = withRepeat(
        withSequence(withDelay(3400, withTiming(-16, { duration: 110 })), withTiming(6, { duration: 110 }), withSpring(0, springs.bouncy)),
        -1,
      );
    }
  }, [mood, reduceMotion]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    cancelAnimation(blink);
    blink.value = 1;
    if (!blinks[mood]) return;
    // Blinking is kept under Reduce Motion: it's tiny and it's what makes him feel alive.
    blink.value = withRepeat(
      withSequence(withDelay(2600 + Math.random() * 1200, withTiming(0.1, { duration: 70 })), withTiming(1, { duration: 90 })),
      -1,
    );
    return () => cancelAnimation(blink);
  }, [mood, blink]);

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: hop.value + sink.value + breathe.value * 1.5 },
      { rotate: `${wobble.value}deg` },
      { scaleY: 1 + breathe.value * 0.012 },
    ],
  }));
  const headStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${tilt.value}deg` }] }));
  const earLStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${earL.value + wiggle.value}deg` }] }));
  const earRStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${earR.value}deg` }] }));
  const eyesStyle = useAnimatedStyle(() => ({ transform: [{ scaleY: blink.value }] }));
  const shadowStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: 1 + hop.value / 60 }],
    opacity: 0.14 + hop.value / 300,
  }));

  const label = accessibilityLabel ?? `Haggle the llama, ${moodDescription[mood]}`;
  const fade = FadeIn.duration(durations.fast);

  return (
    <View
      style={{ width: size, height: size }}
      accessible={!decorative}
      accessibilityRole={decorative ? undefined : 'image'}
      accessibilityLabel={decorative ? undefined : label}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
      accessibilityElementsHidden={decorative}
      pointerEvents="none"
    >
      <Animated.View style={[StyleSheet.absoluteFill, shadowStyle]}>
        <Layer>
          <Ellipse cx={100} cy={196} rx={52} ry={5} fill={ink} />
        </Layer>
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, bodyStyle, { transformOrigin: '50% 100%' }]}>
        <BodyArt />
        <Animated.View style={[StyleSheet.absoluteFill, headStyle, { transformOrigin: '50% 62%' }]}>
          <Animated.View style={[StyleSheet.absoluteFill, earLStyle, { transformOrigin: '37% 28%' }]}>
            <Ear side="left" />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, earRStyle, { transformOrigin: '63% 28%' }]}>
            <Ear side="right" />
          </Animated.View>
          <HeadArt hat={mood === 'celebrating'} />
          <Animated.View style={[StyleSheet.absoluteFill, eyesStyle, { transformOrigin: '50% 40%' }]}>
            <Animated.View key={`eyes-${mood}`} entering={fade} style={StyleSheet.absoluteFill}>
              <Eyes mood={mood} />
            </Animated.View>
          </Animated.View>
          <Animated.View key={`mouth-${mood}`} entering={fade} style={StyleSheet.absoluteFill}>
            <Mouth mood={mood} />
          </Animated.View>
          {mood === 'celebrating' ? (
            <Animated.View entering={fade} style={StyleSheet.absoluteFill}>
              <PartyHat />
            </Animated.View>
          ) : null}
        </Animated.View>
      </Animated.View>
      <Overlay key={mood} mood={mood} reduceMotion={reduceMotion} />
    </View>
  );
}
