/**
 * Format a date string to a readable french locale format.
 * e.g. "2026-04-09T18:00:00Z" → "9 avr. 2026"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format an amount to a readable currency string.
 * e.g. 42.5 → "42,50 €"
 */
export function formatAmount(amount: number): string {
  return amount.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
