/**
 * The mascot's public contract. Both the Reanimated/SVG placeholder and the
 * future Rive implementation satisfy exactly this, so swapping is one line in
 * `Mascot.tsx`.
 */
export const MASCOT_MOODS = [
  'idle',
  'thinking',
  'happy',
  'wink',
  'excited',
  'sad',
  'celebrating',
  'sleeping',
] as const;

export type MascotMood = (typeof MASCOT_MOODS)[number];

export type MascotProps = {
  mood: MascotMood;
  /** Rendered width and height in points. */
  size?: number;
  /** Hide from screen readers when the surrounding UI already says what's happening. */
  decorative?: boolean;
  /** Overrides the default "Haggle the llama, …" description. */
  accessibilityLabel?: string;
};

/** Numeric value of the Rive state machine's `mood` input. Order is part of the contract. */
export const moodIndex: Record<MascotMood, number> = Object.fromEntries(
  MASCOT_MOODS.map((m, i) => [m, i]),
) as Record<MascotMood, number>;

export const moodDescription: Record<MascotMood, string> = {
  idle: 'waiting for you',
  thinking: 'thinking, searching stores',
  happy: 'happy',
  wink: 'winking, that is a good price',
  excited: 'excited, found a deal',
  sad: 'sad, the price went up',
  celebrating: 'celebrating, you saved money',
  sleeping: 'asleep',
};
