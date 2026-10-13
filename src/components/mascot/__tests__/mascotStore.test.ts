import { emitMascot, moodForEvent, moodHoldMs, useMascotStore } from '../mascotStore';
import { MASCOT_MOODS, moodIndex } from '../types';

describe('mascot store', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useMascotStore.setState({ mood: 'idle', lastEvent: 'ready' });
  });
  afterEach(() => jest.useRealTimers());

  it('maps every event to a real mood', () => {
    for (const mood of Object.values(moodForEvent)) expect(MASCOT_MOODS).toContain(mood);
  });

  it('uses every mood for at least one event', () => {
    const used = new Set(Object.values(moodForEvent));
    for (const m of MASCOT_MOODS) expect(used.has(m)).toBe(true);
  });

  it('transient moods fall back to idle', () => {
    emitMascot('dealFound');
    expect(useMascotStore.getState().mood).toBe('excited');
    jest.advanceTimersByTime(moodHoldMs.excited! + 1);
    expect(useMascotStore.getState().mood).toBe('idle');
  });

  it('persistent moods stay until the next event', () => {
    emitMascot('searchStarted');
    jest.advanceTimersByTime(60_000);
    expect(useMascotStore.getState().mood).toBe('thinking');
    emitMascot('offline');
    expect(useMascotStore.getState().mood).toBe('sleeping');
  });

  it('a new event cancels a pending fallback', () => {
    emitMascot('goodPrice');
    jest.advanceTimersByTime(1000);
    emitMascot('searchStarted');
    jest.advanceTimersByTime(10_000);
    expect(useMascotStore.getState().mood).toBe('thinking');
  });

  it('Rive mood indices are stable and contiguous', () => {
    expect(moodIndex).toEqual({ idle: 0, thinking: 1, happy: 2, wink: 3, excited: 4, sad: 5, celebrating: 6, sleeping: 7 });
  });
});
