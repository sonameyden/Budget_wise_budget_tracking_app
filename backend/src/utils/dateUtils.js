/**
 * dateUtils.js
 * Pure date utility functions used by the analytics service.
 * All functions are framework-independent and easily testable.
 */

/**
 * Returns the current month (1–12) and year as an object.
 * @returns {{ month: number, year: number }}
 */
const getCurrentMonthYear = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1, // getMonth() is 0-indexed
    year: now.getFullYear(),
  };
};

/**
 * Returns the first and last date of a given month as ISO date strings.
 * @param {number} month - Month (1–12)
 * @param {number} year  - Full year (e.g. 2026)
 * @returns {{ startDate: string, endDate: string }}
 */
const getMonthDateRange = (month, year) => {
  // First day of the month
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  // Last day: day 0 of next month = last day of this month
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];
  return { startDate, endDate };
};

/**
 * Returns the start/end date range for a given period string.
 * @param {'week'|'month'|'year'} period
 * @returns {{ startDate: string, endDate: string }}
 */
const getDateRangeForPeriod = (period) => {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  let startDate;

  if (period === 'week') {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 6); // last 7 days inclusive
    startDate = weekAgo.toISOString().split('T')[0];
  } else if (period === 'year') {
    startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
  } else {
    // Default: current month
    startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split('T')[0];
  }

  return { startDate, endDate };
};

/**
 * Generates an array of all date strings (YYYY-MM-DD) between start and end inclusive.
 * Used to fill in zero-value days for charts.
 * @param {string} startDate - ISO date string
 * @param {string} endDate   - ISO date string
 * @returns {string[]}
 */
const generateDateRange = (startDate, endDate) => {
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

module.exports = {
  getCurrentMonthYear,
  getMonthDateRange,
  getDateRangeForPeriod,
  generateDateRange,
};
