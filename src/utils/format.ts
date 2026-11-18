/** $50k, $1.2M, $100M, $1B */
export function formatDollars(value: number): string {
  const fmt = (n: number) => (n >= 10 ? Math.round(n).toString() : n.toFixed(1).replace(/\.0$/, ''));
  if (value >= 1e9) return `$${fmt(value / 1e9)}B`;
  if (value >= 1e6) return `$${fmt(value / 1e6)}M`;
  if (value >= 1e3) return `$${fmt(value / 1e3)}k`;
  return `$${Math.round(value)}`;
}

/** Rounds away floating-point noise from range inputs (e.g. 98.80000000001 -> 98.8). */
export function roundToStep(value: number, step: number): number {
  const decimals = (step.toString().split('.')[1] || '').length;
  return Number(value.toFixed(decimals));
}
