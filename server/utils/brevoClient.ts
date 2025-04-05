/**
 * brevoClient.ts
 *
 * This module initializes the Brevo (formerly Sendinblue) client using the official @getbrevo/brevo package.
 * It uses the recommended TypeScript-friendly approach with proper ESM imports.
 *
 * Prerequisites:
 *  - npm install @getbrevo/brevo@2.1.1
 *  - Ensure the environment variable BREVO_API_KEY is set.
 *  - tsconfig.json should include "esModuleInterop": true and "allowSyntheticDefaultImports": true.
 */

import { TransactionalEmailsApi, ContactsApi } from '@getbrevo/brevo/dist/api/apis';
import { SendSmtpEmail, CreateContact, GetExtendedContactDetails } from '@getbrevo/brevo/dist/model/models';
import { TransactionalEmailsApiApiKeys, ContactsApiApiKeys } from '@getbrevo/brevo/dist/api/apis';

// Initialize API instances with configuration
const apiKey = process.env.BREVO_API_KEY || '';

const transactionalEmailsApi = new TransactionalEmailsApi();
transactionalEmailsApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);

const contactsApi = new ContactsApi();
contactsApi.setApiKey(ContactsApiApiKeys.apiKey, apiKey);

// Interface definitions
export interface EmailResponse {
  messageId: string;
}

export interface ContactResponse {
  id: number;
}

export interface ContactInfoResponse {
  email: string;
  id: number;
  emailBlacklisted: boolean;
  smsBlacklisted: boolean;
  createdAt: string;
  modifiedAt: string;
  attributes: Record<string, any>;
}

// Utility function to clean email addresses
const cleanEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

// Send email function
export const sendEmail = async (
  to: string[],
  subject: string,
  htmlContent: string,
  sender = { email: 'noreply@physiq.ai', name: 'PhysIQ' }
): Promise<EmailResponse> => {
  try {
    const emailData = {
      sender,
      to: to.map(email => ({ email: cleanEmail(email) })),
      subject,
      htmlContent
    };

    const response = await transactionalEmailsApi.sendTransacEmail(emailData);
    if (!response || !response.body) {
      throw new Error('Invalid response from Brevo API');
    }
    return { messageId: response.body.messageId || '' };
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new Error(error.message || 'Failed to send email');
  }
};

// Create contact function
export const createContact = async (
  email: string,
  data: {
    attributes?: Record<string, any>;
    listIds?: number[];
  } = {}
): Promise<ContactResponse> => {
  try {
    const createContact = new CreateContact();
    createContact.email = cleanEmail(email);
    if (data.attributes) {
      createContact.attributes = data.attributes;
    }
    if (data.listIds) {
      createContact.listIds = data.listIds;
    }

    const response = await contactsApi.createContact(createContact);
    if (!response || !response.body) {
      throw new Error('Invalid response from Brevo API');
    }
    return { id: response.body.id || 0 };
  } catch (error: any) {
    console.error('Error creating contact:', error);
    throw new Error(error.message || 'Failed to create contact');
  }
};

// Get contact info function
export const getContactInfo = async (email: string): Promise<ContactInfoResponse | null> => {
  try {
    const response = await contactsApi.getContactInfo(cleanEmail(email));
    if (!response || !response.body) {
      return null;
    }
    
    return {
      email: response.body.email || '',
      id: response.body.id || 0,
      emailBlacklisted: response.body.emailBlacklisted || false,
      smsBlacklisted: response.body.smsBlacklisted || false,
      createdAt: response.body.createdAt || '',
      modifiedAt: response.body.modifiedAt || '',
      attributes: response.body.attributes || {}
    };
  } catch (error: any) {
    if (error.statusCode === 404) {
      return null;
    }
    console.error('Error getting contact info:', error);
    throw new Error(error.message || 'Failed to get contact info');
  }
};

// Update contact function
export const updateContact = async (
  email: string,
  data: {
    attributes?: Record<string, any>;
    listIds?: number[];
  }
): Promise<void> => {
  try {
    const updateData: any = {};
    if (data.attributes) {
      updateData.attributes = data.attributes;
    }
    if (data.listIds) {
      updateData.listIds = data.listIds;
    }

    const response = await contactsApi.updateContact(cleanEmail(email), updateData);
    if (!response || !response.body) {
      throw new Error('Invalid response from Brevo API');
    }
  } catch (error: any) {
    console.error('Error updating contact:', error);
    throw new Error(error.message || 'Failed to update contact');
  }
};

// Send email with template function
export const sendEmailWithTemplate = async (
  to: string[],
  templateId: number,
  params: Record<string, any> = {},
  sender = { email: 'noreply@physiq.ai', name: 'PhysIQ' }
): Promise<EmailResponse> => {
  try {
    const emailData = {
      sender,
      to: to.map(email => ({ email: cleanEmail(email) })),
      templateId,
      params
    };

    const response = await transactionalEmailsApi.sendTransacEmail(emailData);
    if (!response || !response.body) {
      throw new Error('Invalid response from Brevo API');
    }
    return { messageId: response.body.messageId || '' };
  } catch (error: any) {
    console.error('Error sending email with template:', error);
    throw new Error(error.message || 'Failed to send email with template');
  }
};

// Export the API instances for use in other parts of the application
export { transactionalEmailsApi, contactsApi }; 