import { useReducedMotion } from 'react-native-reanimated';

import { useSettings } from '../state/settingsStore';

/**
 * True when either the OS or the in-app setting asks for reduced motion.
 * When true, components swap movement (translate/scale/rotate) for opacity fades.
 */
export function useReduceMotion(): boolean {
  const system = useReducedMotion();
  const app = useSettings((s) => s.reduceMotion);
  return system || app;
}

/** Whether the OS itself has Reduce Motion on (used to explain a locked toggle). */
export function useSystemReduceMotion(): boolean {
  return useReducedMotion();
}
