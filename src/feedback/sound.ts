import { createAudioPlayer, type AudioPlayer } from 'expo-audio';

type SoundName = 'success' | 'warning' | 'error';

const sources: Record<SoundName, number> = {
  success: require('../../assets/sounds/success.wav'),
  warning: require('../../assets/sounds/warning.wav'),
  error: require('../../assets/sounds/error.wav'),
};

// Players are created lazily on first use so sound costs nothing at cold start.
const players: Partial<Record<SoundName, AudioPlayer>> = {};

export function playSound(name: SoundName): void {
  try {
    let player = players[name];
    if (!player) {
      player = createAudioPlayer(sources[name]);
      player.volume = 0.6;
      players[name] = player;
    }
    player.seekTo(0).catch(() => {});
    player.play();
  } catch {
    // Audio is optional; failing silently is the correct behavior.
  }
}
