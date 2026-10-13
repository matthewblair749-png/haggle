import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { useSettings } from '../../state/settingsStore';
import { Badge, PresetBadge } from '../Badge';
import { Button } from '../Button';
import { CountUp } from '../CountUp';
import { Mascot } from '../mascot/Mascot';
import { ToggleRow } from '../ToggleRow';
import { Verdict } from '../Verdict';

describe('Button', () => {
  it('is an accessible button that fires onPress', async () => {
    const onPress = jest.fn();
    await render(<Button label="Find the best price" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Find the best price' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire when disabled or loading, and says so', async () => {
    const onPress = jest.fn();
    const { rerender } = await render(<Button label="Buy" onPress={onPress} disabled />);
    await fireEvent.press(screen.getByRole('button', { name: 'Buy' }));
    expect(screen.getByRole('button', { name: 'Buy' })).toBeDisabled();
    await rerender(<Button label="Buy" onPress={onPress} loading />);
    await fireEvent.press(screen.getByRole('button', { name: 'Buy' }));
    expect(screen.getByRole('button', { name: 'Buy' })).toBeBusy();
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('Verdict', () => {
  it('reads as words, not just color', async () => {
    await render(<Verdict verdict="wait" reason="Usually drops in November." />);
    expect(screen.getByLabelText('Verdict: Wait. Usually drops in November.')).toBeOnTheScreen();
  });
});

describe('Badges', () => {
  it('discloses sponsored and affiliate results in plain words', async () => {
    await render(
      <>
        <PresetBadge preset="sponsored" />
        <PresetBadge preset="affiliate" />
      </>,
    );
    expect(screen.getByText('Sponsored')).toBeOnTheScreen();
    expect(screen.getByLabelText(/Affiliate link\. Haggle may earn a small commission/)).toBeOnTheScreen();
  });

  it('renders custom badges', async () => {
    await render(<Badge label="Best" icon="check" />);
    expect(screen.getByText('Best')).toBeOnTheScreen();
  });
});

describe('Mascot', () => {
  it('describes its mood to screen readers', async () => {
    await render(<Mascot mood="celebrating" />);
    expect(screen.getByLabelText('Haggle the llama, celebrating, you saved money')).toBeOnTheScreen();
  });

  it('can be decorative', async () => {
    await render(<Mascot mood="idle" decorative />);
    expect(screen.queryByLabelText(/Haggle the llama/)).toBeNull();
  });
});

describe('ToggleRow', () => {
  it('is a switch with checked state', async () => {
    const onChange = jest.fn();
    await render(<ToggleRow label="Haptics" value={false} onChange={onChange} />);
    const sw = screen.getByRole('switch', { name: 'Haptics' });
    expect(sw).not.toBeChecked();
    await fireEvent.press(sw);
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe('CountUp', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('announces the final value immediately and lands on it', async () => {
    await render(<CountUp cents={12840} />);
    expect(screen.getByLabelText('128 dollars and 40 cents')).toBeOnTheScreen();
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText('$128.40')).toBeOnTheScreen();
  });

  it('shows the final value straight away with reduced motion', async () => {
    useSettings.getState().set('reduceMotion', true);
    await render(<CountUp cents={12840} />);
    expect(screen.getByText('$128.40')).toBeOnTheScreen();
    await act(async () => useSettings.getState().set('reduceMotion', false));
  });
});
