import express from 'express';
import type { ApiClientConstructor, CreateContactParams, SendEmailParams } from '../types/brevo';
import { ApiClient } from '@getbrevo/brevo';

const router = express.Router();

// Initialize Brevo client
const brevoClient = new ApiClient({
  apiKey: process.env.BREVO_API_KEY || '',
});

// Create or update contact
export async function createContact(params: CreateContactParams) {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY environment variable is not set');
  }

  try {
    const response = await brevoClient.contactsApi.createContact(params);
    return response;
  } catch (error: any) {
    if (error.response?.body?.message?.includes('already exists')) {
      // Get existing contact
      const getResponse = await brevoClient.contactsApi.getContactInfo(params.email);
      
      if (!getResponse.id) {
        throw new Error('Failed to get contact ID');
      }

      // Update contact
      const updateResponse = await brevoClient.contactsApi.updateContact(getResponse.id, {
        ...params,
        attributes: {
          ...getResponse.attributes,
          ...params.attributes
        }
      });

      return updateResponse;
    }
    throw error;
  }
}

// Send email
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
    console.error('Error sending email:', error);
    throw error;
  }
}

export default router;