/** Up to 2 decimal places (e.g. 15, 15.5, 15.00). */
export const decimalRegex = /^\d+(\.\d{1,2})?$/;

/**
 * Alias kept for existing imports — portal standard is 2 decimal places.
 * Previously allowed 3 decimals; now matches `decimalRegex`.
 */
export const uptoThreeDigitDecimalRegex = decimalRegex;

/** Up to 3 decimal places (e.g. 15, 0.5, 0.095). */
export const threeDecimalRegex = /^\d+(\.\d{1,3})?$/;

/** Rates are accepted exactly as entered — any number of decimal places. */
export const rateRegex = /^\d+(\.\d+)?$/;
