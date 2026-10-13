import { formatCents, spokenCents } from '../money';

describe('money', () => {
  it('formats cents as USD', () => {
    expect(formatCents(24999)).toBe('$249.99');
    expect(formatCents(123456789)).toBe('$1,234,567.89');
    expect(formatCents(0)).toBe('$0.00');
    expect(formatCents(24999, { whole: true })).toBe('$250');
  });

  it('speaks money naturally for screen readers', () => {
    expect(spokenCents(24999)).toBe('249 dollars and 99 cents');
    expect(spokenCents(100)).toBe('1 dollar');
    expect(spokenCents(101)).toBe('1 dollar and 1 cent');
    expect(spokenCents(-500)).toBe('minus 5 dollars');
  });
});
