/** Upper bound keeps obviously-wrong inputs out (₹1 crore). */
export const MAX_AMOUNT = 10000000;

/** Parse a user-typed amount string, tolerating commas/spaces and stray text. */
export function parseAmount(raw: string): number {
  if (!raw) return NaN;
  const cleaned = raw.replace(/[₹,\s]/g, '');
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : NaN;
}

export function isValidAmount(value: number): boolean {
  return Number.isFinite(value) && value >= 1 && value <= MAX_AMOUNT;
}
