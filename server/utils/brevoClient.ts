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
import { IncomingMessage } from 'http';
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
    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.to = to.map(email => ({ email: cleanEmail(email) }));
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = sender;

    const { body } = await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
    return { messageId: body.messageId || '' };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Create contact function
export const createContact = async (
  email: string,
  attributes: Record<string, any> = {}
): Promise<ContactResponse> => {
  try {
    const createContact = new CreateContact();
    createContact.email = cleanEmail(email);
    createContact.attributes = attributes;

    const { body } = await contactsApi.createContact(createContact);
    return { id: body.id || 0 };
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
};

// Get contact info function
export const getContactInfo = async (email: string): Promise<ContactInfoResponse | null> => {
  try {
    const { body } = await contactsApi.getContactInfo(cleanEmail(email));
    if (!body) return null;
    
    return {
      email: body.email || '',
      id: body.id || 0,
      emailBlacklisted: body.emailBlacklisted || false,
      smsBlacklisted: body.smsBlacklisted || false,
      createdAt: body.createdAt || '',
      modifiedAt: body.modifiedAt || '',
      attributes: body.attributes || {}
    };
  } catch (error) {
    if ((error as any).statusCode === 404) {
      return null;
    }
    console.error('Error getting contact info:', error);
    throw error;
  }
};

// Update contact function
export const updateContact = async (
  email: string,
  attributes: Record<string, any>
): Promise<void> => {
  try {
    await contactsApi.updateContact(cleanEmail(email), { attributes });
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
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
    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.to = to.map(email => ({ email: cleanEmail(email) }));
    sendSmtpEmail.templateId = templateId;
    sendSmtpEmail.params = params;
    sendSmtpEmail.sender = sender;

    const { body } = await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
    return { messageId: body.messageId || '' };
  } catch (error) {
    console.error('Error sending email with template:', error);
    throw error;
  }
};

// Export the API instances for use in other parts of the application
export { transactionalEmailsApi, contactsApi }; 