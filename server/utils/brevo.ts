import type { ApiClientConstructor, BrevoError, CreateContactParams, SendEmailParams } from '../types/brevo';

// Import the actual API client constructor
const { ApiClient } = require('@getbrevo/brevo');

const brevoClient = (ApiClient as ApiClientConstructor)({
  apiKey: process.env.BREVO_API_KEY || '',
});

const BREVO_API_URL = 'https://api.brevo.com/v3';

export const CONTACT_LISTS = {
  WEBSITE_LEADS: 2
};

export async function sendEmail(params: SendEmailParams) {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY environment variable is not set');
  }

  try {
    const response = await brevoClient.transactionalEmailsApi.sendTransacEmail({
      sender: { email: 'noreply@advelocity.ai', name: 'AdVelocity' },
      ...params
    });
    return response;
  } catch (error) {
    const brevoError = error as BrevoError;
    console.error('Error sending email:', error);
    throw new Error(brevoError.message || 'Failed to send email');
  }
}

export async function createContact(params: CreateContactParams) {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY environment variable is not set');
  }

  try {
    const response = await brevoClient.contactsApi.createContact(params);
    return response;
  } catch (error) {
    const brevoError = error as BrevoError;
    if (brevoError.response?.body?.message?.includes('already exists')) {
      try {
        // Get existing contact
        const existingContact = await brevoClient.contactsApi.getContactInfo(params.email);
        
        if (!existingContact || !existingContact.id) {
          throw new Error('Failed to retrieve existing contact details');
        }

        // Update contact
        const updateResponse = await brevoClient.contactsApi.updateContact(existingContact.id, {
          ...params,
          attributes: {
            ...existingContact.attributes,
            ...params.attributes
          }
        });

        return updateResponse;
      } catch (updateError) {
        console.error('Error updating existing contact:', updateError);
        throw new Error('Failed to update existing contact');
      }
    }
    throw new Error(brevoError.message || 'Failed to create contact');
  }
} 