/**
 * Sample Utility: String Helpers
 * Contains utility functions for string manipulation.
 */

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The input string
 * @returns {string} - Capitalized string
 */
const capitalizeFirst = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncates a string to specified length with ellipsis
 * @param {string} str - The input string
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated string
 */
const truncateString = (str, maxLength = 50) => {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
};

/**
 * Sanitizes a string by removing special characters
 * @param {string} str - The input string
 * @returns {string} - Sanitized string
 */
const sanitizeString = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[^a-zA-Z0-9\s]/g, '');
};

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether email is valid
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Formats phone number to standard format
 * @param {string} phone - The phone number
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

module.exports = {
  capitalizeFirst,
  truncateString,
  sanitizeString,
  isValidEmail,
  formatPhoneNumber
};
