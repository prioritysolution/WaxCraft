/** Up to 2 decimal places (e.g. 15, 15.5, 15.00). */
export const decimalRegex = /^\d+(\.\d{1,2})?$/;

/**
 * Alias kept for existing imports — portal standard is 2 decimal places.
 * Previously allowed 3 decimals; now matches `decimalRegex`.
 */
export const uptoThreeDigitDecimalRegex = decimalRegex;
