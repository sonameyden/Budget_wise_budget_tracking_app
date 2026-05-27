/**
 * formatCurrency.js — currency formatting using the user's selected currency.
 * Import useCurrency() from AuthContext to get the active currency code,
 * then pass it here. Or call formatCurrency(amount, currency) directly.
 */

const CURRENCY_LOCALES = {
  USD: 'en-US', EUR: 'de-DE', GBP: 'en-GB',
  JPY: 'ja-JP', CAD: 'en-CA', AUD: 'en-AU',
  SGD: 'en-SG', INR: 'en-IN', BTN: 'en-IN',
};

/**
 * Format a number as currency.
 * @param {number} amount
 * @param {string} currency - ISO 4217 code e.g. 'USD', 'BTN'
 */
export const formatCurrency = (amount, currency = 'USD') => {
  // BTN (Bhutanese Ngultrum) not supported by Intl natively — use Nu. prefix
  if (currency === 'BTN') {
    return `Nu. ${(amount ?? 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    })}`;
  }

  const locale = CURRENCY_LOCALES[currency] || 'en-US';
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount ?? 0);
  } catch {
    // Fallback for unsupported currency codes
    return `${currency} ${(amount ?? 0).toFixed(2)}`;
  }
};

export const formatCompact = (amount, currency = 'USD') => {
  if (currency === 'BTN') {
    const abs = Math.abs(amount ?? 0);
    if (abs >= 1000) return `Nu. ${(amount / 1000).toFixed(1)}k`;
    return `Nu. ${(amount ?? 0).toFixed(2)}`;
  }
  if (Math.abs(amount ?? 0) >= 1000) {
    const locale = CURRENCY_LOCALES[currency] || 'en-US';
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency', currency,
        notation: 'compact', maximumFractionDigits: 1,
      }).format(amount ?? 0);
    } catch { return formatCurrency(amount, currency); }
  }
  return formatCurrency(amount, currency);
};
