/**
 * phone.ts
 * 
 * Utility functions for phone number formatting and validation.
 */

/**
 * Format a phone number for Brevo:
 * - Clean the number to just digits
 * - Add +1 prefix for US numbers
 * 
 * @param phone The phone number to format
 * @returns The formatted phone number
 * @throws Error if phone number is invalid
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) {
    throw new Error('Phone number is required');
  }

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // For US numbers, we expect 10 digits
  if (digits.length !== 10) {
    throw new Error('Phone number must be exactly 10 digits');
  }

  // Add +1 prefix for US numbers
  return '+1' + digits;
} 