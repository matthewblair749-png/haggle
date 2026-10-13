import * as Haptics from 'expo-haptics';
import { createAudioPlayer } from 'expo-audio';
import { Platform } from 'react-native';

import { useSettings } from '../../state/settingsStore';
import { feedback } from '../feedback';

describe('feedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useSettings.getState().reset();
  });

  it('maps each meaning to one haptic', () => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
    feedback('select');
    expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
    feedback('success');
    expect(Haptics.notificationAsync).toHaveBeenLastCalledWith(Haptics.NotificationFeedbackType.Success);
    feedback('warning');
    expect(Haptics.notificationAsync).toHaveBeenLastCalledWith(Haptics.NotificationFeedbackType.Warning);
  });

  it('respects the haptics toggle', () => {
    useSettings.getState().set('hapticsEnabled', false);
    feedback('success');
    expect(Haptics.notificationAsync).not.toHaveBeenCalled();
    expect(Haptics.selectionAsync).not.toHaveBeenCalled();
  });

  it('is silent by default and never plays sound for taps', () => {
    feedback('success');
    expect(createAudioPlayer).not.toHaveBeenCalled();
    useSettings.getState().set('soundEnabled', true);
    feedback('select');
    expect(createAudioPlayer).not.toHaveBeenCalled();
    feedback('success');
    expect(createAudioPlayer).toHaveBeenCalledTimes(1);
  });
});
