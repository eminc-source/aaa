/**
 * Format a number with commas for thousands
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

/**
 * Format a number as ALGO with the Ⱥ symbol
 */
export const formatAlgo = (num: number): string => {
  return 'Ⱥ ' + num.toLocaleString('en-US');
};

/**
 * Format a number as USD currency
 */
export const formatCurrency = (num: number): string => {
  return '$' + num.toLocaleString('en-US');
};

/**
 * Format a number in compact form (e.g., 1.4B, 500M, -125M)
 */
export const formatCompact = (num: number): string => {
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum >= 1_000_000_000) {
    return sign + (absNum / 1_000_000_000).toFixed(1) + 'B';
  }
  if (absNum >= 1_000_000) {
    return sign + (absNum / 1_000_000).toFixed(1) + 'M';
  }
  if (absNum >= 1_000) {
    return sign + (absNum / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Format date string for display
 */
export const formatDate = (dateStr: string): string => {
  return dateStr.toUpperCase();
};
