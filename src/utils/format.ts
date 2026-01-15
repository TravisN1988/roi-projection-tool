// Formatting utilities for currency and numbers

/**
 * Format a number as currency (USD)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string like "$1,234,567"
 */
export function formatCurrency(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a number with thousand separators
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string like "1,234,567"
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a number as a percentage
 * @param value - The number to format (0.4 = 40%)
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted string like "40%"
 */
export function formatPercent(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Parse a formatted currency string back to a number
 * @param value - The formatted string like "$1,234,567"
 * @returns The numeric value
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Parse a formatted number string back to a number
 * @param value - The formatted string like "1,234,567"
 * @returns The numeric value
 */
export function parseNumber(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Parse a percentage string back to a decimal
 * @param value - The formatted string like "40%" or "40"
 * @returns The decimal value (0.4)
 */
export function parsePercent(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) return 0;
  // If value was entered as whole number (40), convert to decimal (0.4)
  return parsed > 1 ? parsed / 100 : parsed;
}
