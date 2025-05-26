/**
 * phone.ts
 * 
 * Utility functions for phone number formatting and validation.
 */

/**
 * Format a phone number for Brevo:
 * - Clean the number to just digits
 * - Add +1 prefix for US numbers if not already present
 * - Validate the length
 * 
 * @param phone The phone number to format
 * @returns The formatted phone number
 * @throws Error if phone number is invalid
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) {
    throw new Error('Phone number is required');
  }

  // Check if phone already starts with +
  let formattedPhone = phone.trim();
  
  if (formattedPhone.startsWith('+')) {
    // Already has country code, just remove non-digit characters except the + sign
    formattedPhone = '+' + formattedPhone.substring(1).replace(/\D/g, '');
  } else {
    // Remove all non-digit characters
    const digits = formattedPhone.replace(/\D/g, '');
    
    // For US numbers, we expect 10 digits (or 11 if includes country code without +)
    if (digits.length === 11 && digits.startsWith('1')) {
      // Already has US country code (1)
      formattedPhone = '+' + digits;
    } else if (digits.length === 10) {
      // Add +1 prefix for US numbers
      formattedPhone = '+1' + digits;
    } else {
      throw new Error(`Invalid phone number format: ${phone}. Must be 10 digits for US numbers.`);
    }
  }
  
  // Validate the final format - should be at least 12 chars for international numbers (+XX...)
  if (formattedPhone.length < 12) {
    throw new Error(`Formatted phone number is too short: ${formattedPhone}`);
  }
  
  console.log(`Phone formatting: "${phone}" -> "${formattedPhone}"`);
  return formattedPhone;
} 