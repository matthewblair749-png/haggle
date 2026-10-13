import { create } from 'zustand';

import type { MascotMood } from './types';

/**
 * App events the mascot reacts to. Screens emit events; they never pick a
 * mood directly. This keeps the mascot honest: it's happy because something
 * good actually happened.
 */
export type MascotEvent =
  | 'ready' // app opened / nothing going on
  | 'searchStarted'
  | 'resultsReady' // results came back, nothing special
  | 'goodPrice' // the best price is fair-to-good
  | 'dealFound' // clearly below typical price
  | 'priceRose' // a tracked price went up
  | 'moneySaved' // user bought at a lower price / tracked price dropped
  | 'empty' // nothing to show yet
  | 'offline'
  | 'error';

export const moodForEvent: Record<MascotEvent, MascotMood> = {
  ready: 'idle',
  searchStarted: 'thinking',
  resultsReady: 'happy',
  goodPrice: 'wink',
  dealFound: 'excited',
  priceRose: 'sad',
  moneySaved: 'celebrating',
  empty: 'sleeping',
  offline: 'sleeping',
  error: 'sad',
};

/** Transient moods fall back to idle after this long (ms). Persistent ones stay until the next event. */
export const moodHoldMs: Partial<Record<MascotMood, number>> = {
  happy: 2500,
  wink: 2500,
  excited: 3200,
  celebrating: 3600,
};

type MascotState = {
  mood: MascotMood;
  lastEvent: MascotEvent;
  emit: (event: MascotEvent) => void;
};

let revertTimer: ReturnType<typeof setTimeout> | undefined;

export const useMascotStore = create<MascotState>()((set) => ({
  mood: 'idle',
  lastEvent: 'ready',
  emit: (event) => {
    const mood = moodForEvent[event];
    if (revertTimer) clearTimeout(revertTimer);
    revertTimer = undefined;
    set({ mood, lastEvent: event });
    const hold = moodHoldMs[mood];
    if (hold) {
      revertTimer = setTimeout(() => {
        revertTimer = undefined;
        set({ mood: 'idle' });
      }, hold);
    }
  },
}));

export const emitMascot = (event: MascotEvent) => useMascotStore.getState().emit(event);
