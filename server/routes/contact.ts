import express from 'express';
import type { ApiClient, CreateContactParams, SendEmailParams } from '../types/brevo';
import Brevo from '@getbrevo/brevo';

const router = express.Router();

// Initialize Brevo client
const brevoClient = new Brevo({
  apiKey: process.env.BREVO_API_KEY || '',
}) as ApiClient;

// Create or update contact
export async function createContact(params: CreateContactParams) {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY environment variable is not set');
  }

  try {
    const createResponse = await brevoClient.contactsApi.createContact(params);
    return createResponse;
  } catch (error: any) {
    if (error.response?.body?.message?.includes('already exists')) {
      const getResponse = await brevoClient.contactsApi.getContactInfo(params.email);
      
      if (!getResponse.id) {
        throw new Error('Failed to get contact ID');
      }

      const updatedAttributes = {
        ...getResponse.attributes,
        ...params.attributes
      };

      const updateParams = {
        ...params,
        attributes: updatedAttributes
      };

      const updateResponse = await brevoClient.contactsApi.updateContact(getResponse.id, updateParams);
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
    const emailParams = {
      sender: { email: 'noreply@advelocity.ai', name: 'AdVelocity' },
      ...params
    };
    const response = await brevoClient.transactionalEmailsApi.sendTransacEmail(emailParams);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export default router;