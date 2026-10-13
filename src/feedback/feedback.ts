import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { useSettings } from '../state/settingsStore';
import { playSound } from './sound';

/**
 * One meaning → one haptic (and one optional sound). Never call expo-haptics
 * directly from components; go through here so meanings stay consistent.
 *
 * - select:  light tap. Chips, toggles, tabs, ordinary buttons.
 * - success: deal found, item saved, alert set, money saved.
 * - warning: tracked price went up.
 * - error:   something failed (search error, offline action).
 */
export type FeedbackMeaning = 'select' | 'success' | 'warning' | 'error';

const hapticsSupported = Platform.OS === 'ios' || Platform.OS === 'android';

function haptic(meaning: FeedbackMeaning): Promise<void> {
  switch (meaning) {
    case 'select':
      return Haptics.selectionAsync();
    case 'success':
      return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    case 'warning':
      return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    case 'error':
      return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
}

/** Fire-and-forget. Feedback must never throw or delay the UI. */
export function feedback(meaning: FeedbackMeaning): void {
  const { hapticsEnabled, soundEnabled } = useSettings.getState();
  if (hapticsEnabled && hapticsSupported) {
    haptic(meaning).catch(() => {});
  }
  // Taps stay silent: sound is reserved for moments that matter.
  if (soundEnabled && meaning !== 'select') {
    playSound(meaning);
  }
}
