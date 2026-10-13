import { contrastRatio, palette, tones } from '..';

const AA = 4.5;

describe('color contrast (WCAG AA, normal text)', () => {
  it.each(Object.entries(tones))('%s: label on fill', (_name, t) => {
    expect(contrastRatio(t.label, t.fill)).toBeGreaterThanOrEqual(AA);
  });

  it.each(Object.entries(tones))('%s: accent text on its tint (badges)', (_name, t) => {
    expect(contrastRatio(t.text, t.tint)).toBeGreaterThanOrEqual(AA);
  });

  it.each([
    ['ink', palette.ink],
    ['inkSoft', palette.inkSoft],
    ['inkMuted', palette.inkMuted],
    ['coralText', palette.coralText],
    ['mintText', palette.mintText],
    ['sunshineText', palette.sunshineText],
    ['grapeText', palette.grapeText],
    ['danger', palette.danger],
  ])('%s is readable on cream and white', (_name, c) => {
    expect(contrastRatio(c, palette.cream)).toBeGreaterThanOrEqual(AA);
    expect(contrastRatio(c, palette.white)).toBeGreaterThanOrEqual(AA);
  });

  it('disabled button label still meets AA on sand', () => {
    expect(contrastRatio(palette.inkSoft, palette.sand)).toBeGreaterThanOrEqual(AA);
  });

  it('computes known ratios', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
    expect(contrastRatio('#777777', '#777777')).toBe(1);
  });
});
