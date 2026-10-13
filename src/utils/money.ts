const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const usdWhole = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

/** All money in Haggle is integer cents to avoid float drift. */
export type Cents = number;

export function formatCents(cents: Cents, opts: { whole?: boolean } = {}): string {
  return (opts.whole ? usdWhole : usd).format(cents / 100);
}

/** Screen-reader friendly: "$1,234.50" → "1,234 dollars and 50 cents". */
export function spokenCents(cents: Cents): string {
  const abs = Math.abs(Math.round(cents));
  const dollars = Math.floor(abs / 100);
  const rest = abs % 100;
  const d = `${dollars.toLocaleString('en-US')} ${dollars === 1 ? 'dollar' : 'dollars'}`;
  const sign = cents < 0 ? 'minus ' : '';
  return rest ? `${sign}${d} and ${rest} ${rest === 1 ? 'cent' : 'cents'}` : `${sign}${d}`;
}
