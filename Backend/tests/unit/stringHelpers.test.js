/**
 * Unit Tests for String Helper Utilities
 * Tests various string manipulation functions.
 */

const {
  capitalizeFirst,
  truncateString,
  sanitizeString,
  isValidEmail,
  formatPhoneNumber
} = require('../../utils/stringHelpers');

describe('String Helpers', () => {
  
  // ============================================
  // capitalizeFirst Tests
  // ============================================
  describe('capitalizeFirst', () => {
    test('should capitalize first letter of a lowercase string', () => {
      expect(capitalizeFirst('hello')).toBe('Hello');
    });

    test('should handle already capitalized strings', () => {
      expect(capitalizeFirst('Hello')).toBe('Hello');
    });

    test('should convert uppercase string to title case', () => {
      expect(capitalizeFirst('HELLO')).toBe('Hello');
    });

    test('should return empty string for null input', () => {
      expect(capitalizeFirst(null)).toBe('');
    });

    test('should return empty string for undefined input', () => {
      expect(capitalizeFirst(undefined)).toBe('');
    });

    test('should return empty string for non-string input', () => {
      expect(capitalizeFirst(123)).toBe('');
    });

    test('should handle single character', () => {
      expect(capitalizeFirst('a')).toBe('A');
    });
  });

  // ============================================
  // truncateString Tests
  // ============================================
  describe('truncateString', () => {
    test('should truncate long strings with ellipsis', () => {
      const longString = 'This is a very long string that needs truncation';
      expect(truncateString(longString, 20)).toBe('This is a very lo...');
    });

    test('should not truncate strings shorter than maxLength', () => {
      expect(truncateString('Hello', 10)).toBe('Hello');
    });

    test('should use default maxLength of 50', () => {
      const longString = 'a'.repeat(60);
      const result = truncateString(longString);
      expect(result.length).toBe(50);
      expect(result.endsWith('...')).toBe(true);
    });

    test('should return empty string for null input', () => {
      expect(truncateString(null)).toBe('');
    });

    test('should handle empty string', () => {
      expect(truncateString('')).toBe('');
    });
  });

  // ============================================
  // sanitizeString Tests
  // ============================================
  describe('sanitizeString', () => {
    test('should remove special characters', () => {
      expect(sanitizeString('Hello@World!')).toBe('HelloWorld');
    });

    test('should keep alphanumeric characters and spaces', () => {
      expect(sanitizeString('Hello World 123')).toBe('Hello World 123');
    });

    test('should handle string with only special characters', () => {
      expect(sanitizeString('@#$%^&*()')).toBe('');
    });

    test('should return empty string for null input', () => {
      expect(sanitizeString(null)).toBe('');
    });
  });

  // ============================================
  // isValidEmail Tests
  // ============================================
  describe('isValidEmail', () => {
    test('should return true for valid email', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
    });

    test('should return true for valid email with subdomain', () => {
      expect(isValidEmail('user@mail.example.com')).toBe(true);
    });

    test('should return false for email without @', () => {
      expect(isValidEmail('userexample.com')).toBe(false);
    });

    test('should return false for email without domain', () => {
      expect(isValidEmail('user@')).toBe(false);
    });

    test('should return false for email without extension', () => {
      expect(isValidEmail('user@example')).toBe(false);
    });

    test('should return false for null input', () => {
      expect(isValidEmail(null)).toBe(false);
    });

    test('should return false for empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });

  // ============================================
  // formatPhoneNumber Tests
  // ============================================
  describe('formatPhoneNumber', () => {
    test('should format 10-digit phone number', () => {
      expect(formatPhoneNumber('1234567890')).toBe('123-456-7890');
    });

    test('should handle phone with existing formatting', () => {
      expect(formatPhoneNumber('(123) 456-7890')).toBe('123-456-7890');
    });

    test('should return original for non-10-digit numbers', () => {
      expect(formatPhoneNumber('12345')).toBe('12345');
    });

    test('should return empty string for null input', () => {
      expect(formatPhoneNumber(null)).toBe('');
    });

    test('should return empty string for undefined input', () => {
      expect(formatPhoneNumber(undefined)).toBe('');
    });
  });
});
