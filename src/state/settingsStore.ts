import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Settings = {
  /** Short, optional UI sounds. Off by default: sound is opt-in. */
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  /**
   * In-app Reduce Motion. The effective value is this OR the OS setting, so the
   * app can be calmer than the system but never more animated than it.
   */
  reduceMotion: boolean;
  /** Price-drop notifications. Opt-in only. */
  notificationsEnabled: boolean;
};

type SettingsState = Settings & {
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
};

export const defaultSettings: Settings = {
  soundEnabled: false,
  hapticsEnabled: true,
  reduceMotion: false,
  notificationsEnabled: false,
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      set: (key, value) => set({ [key]: value } as Partial<Settings>),
      reset: () => set(defaultSettings),
    }),
    {
      name: 'haggle.settings.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ soundEnabled, hapticsEnabled, reduceMotion, notificationsEnabled }) => ({
        soundEnabled,
        hapticsEnabled,
        reduceMotion,
        notificationsEnabled,
      }),
    },
  ),
);
