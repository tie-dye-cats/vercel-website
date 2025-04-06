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
import { SendSmtpEmail, CreateContact, CreateDoiContact, GetExtendedContactDetails } from '@getbrevo/brevo/dist/model/models';
import { TransactionalEmailsApiApiKeys, ContactsApiApiKeys } from '@getbrevo/brevo/dist/api/apis';
import request from 'request-promise';

// Initialize API instances with configuration
const apiKey = process.env.BREVO_API_KEY || '';

const transactionalEmailsApi = new TransactionalEmailsApi();
transactionalEmailsApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);

const contactsApi = new ContactsApi();
contactsApi.setApiKey(ContactsApiApiKeys.apiKey, apiKey);

const BREVO_API_BASE = 'https://api.brevo.com/v3';

interface CreateContactParams {
  email: string;
  firstName: string;
  attributes: Record<string, any>;
}

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

// Create contact with double opt-in function
export const createDoiContact = async (
  email: string,
  data: {
    attributes?: Record<string, any>;
    listIds?: number[];
    templateId?: number;
    redirectionUrl?: string;
  } = {}
): Promise<void> => {
  try {
    const doiContact = new CreateDoiContact();
    doiContact.email = cleanEmail(email);
    if (data.attributes) {
      doiContact.attributes = data.attributes;
    }
    if (data.listIds) {
      doiContact.includeListIds = data.listIds;
    }
    if (data.templateId) {
      doiContact.templateId = data.templateId;
    }
    if (data.redirectionUrl) {
      doiContact.redirectionUrl = data.redirectionUrl;
    }

    await contactsApi.createDoiContact(doiContact);
  } catch (error: any) {
    console.error('Error creating DOI contact:', error);
    throw new Error(error.message || 'Failed to create DOI contact');
  }
};

// Create contact function (keeping for backward compatibility)
export const createContact = async (
  email: string,
  data: {
    attributes?: Record<string, any>;
    listIds?: number[];
  }
): Promise<ContactResponse> => {
  try {
    const contact = new CreateDoiContact();
    contact.email = cleanEmail(email);
    contact.attributes = data.attributes || {};
    contact.includeListIds = data.listIds || [];
    contact.templateId = 1;
    contact.redirectionUrl = "https://physiqfitness.com";

    console.log('Creating DOI contact with data:', JSON.stringify(contact, null, 2));
    const response = await contactsApi.createDoiContact(contact);
    
    if (!response || !response.body || !response.body.message) {
      throw new Error('Invalid response from Brevo API');
    }
    
    // DOI contact creation returns a message instead of an ID
    return { id: 0 }; // Temporary ID since DOI is pending
  } catch (error: any) {
    console.error('Brevo API error:', {
      message: error.message,
      response: error.response?.body,
      statusCode: error.response?.statusCode
    });
    
    // Handle specific error cases
    if (error.response?.body?.code === 'duplicate_parameter') {
      throw new Error('Contact already exists');
    } else if (error.response?.body?.message?.includes('Invalid phone number')) {
      console.error('Phone number error details:', error.response?.body);
      throw new Error('Invalid phone number format. Please ensure the number is in the correct format.');
    }
    
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

export async function createContactWithParams(params: CreateContactParams): Promise<any> {
  try {
    const response = await request({
      method: 'POST',
      url: `${BREVO_API_BASE}/contacts`,
      headers: {
        'Accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY as string
      },
      json: true,
      body: {
        email: params.email,
        attributes: {
          ...params.attributes,
          FIRSTNAME: params.firstName
        },
        listIds: [2],
        updateEnabled: false
      }
    });
    return response;
  } catch (error: any) {
    console.error('Brevo API Error:', {
      statusCode: error.statusCode,
      message: error.message,
      response: error.response?.body
    });
    throw new Error(error.response?.body?.message || error.message || 'HTTP request failed');
  }
} 