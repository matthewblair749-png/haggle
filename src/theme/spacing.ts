/** 4pt base grid. */
export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radii = {
  sm: 20,
  md: 24,
  lg: 28,
  xl: 34,
  pill: 999,
} as const;

/** Depth of the bottom-edge "pressable" shadow. Collapses to 0 on press. */
export const depth = {
  sm: 4,
  md: 6,
  lg: 8,
} as const;

/** Minimum touch target (Apple HIG 44pt). */
export const minTapTarget = 44;

/** Side gutter for screens. */
export const gutter = space.lg;
