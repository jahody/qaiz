function parseHex(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** '#F59E0B', 0.2 -> 'rgba(245, 158, 11, 0.2)' */
export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Mixes a hex color toward black: 0 leaves it unchanged, 1 gives black. */
export function darken(hex: string, amount: number): string {
  const [r, g, b] = parseHex(hex).map((c) => Math.round(c * (1 - amount)));
  return `rgb(${r}, ${g}, ${b})`;
}
