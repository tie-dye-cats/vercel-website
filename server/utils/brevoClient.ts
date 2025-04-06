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

import axios from 'axios';

const BREVO_API_BASE = 'https://api.brevo.com/v3';
const BREVO_API_KEY = process.env.BREVO_API_KEY;

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

// Create axios instance with default config
const api = axios.create({
  baseURL: BREVO_API_BASE,
  headers: {
    'Accept': 'application/json',
    'api-key': BREVO_API_KEY,
    'Content-Type': 'application/json'
  }
});

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
    const response = await api.post('/smtp/email', {
      sender,
      to: to.map(email => ({ email: cleanEmail(email) })),
      subject,
      htmlContent
    });
    return { messageId: response.data.messageId || '' };
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to send email');
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
    const response = await api.post('/contacts', {
      email: cleanEmail(email),
      attributes: data.attributes || {},
      listIds: data.listIds || [],
      updateEnabled: true
    });
    return { id: response.data.id || 0 };
  } catch (error: any) {
    console.error('Error creating contact:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to create contact');
  }
};

// Get contact info function
export const getContactInfo = async (email: string): Promise<ContactInfoResponse | null> => {
  try {
    const response = await api.get(`/contacts/${cleanEmail(email)}`);
    const data = response.data;
    
    return {
      email: data.email || '',
      id: data.id || 0,
      emailBlacklisted: data.emailBlacklisted || false,
      smsBlacklisted: data.smsBlacklisted || false,
      createdAt: data.createdAt || '',
      modifiedAt: data.modifiedAt || '',
      attributes: data.attributes || {}
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('Error getting contact info:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to get contact info');
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
    await api.put(`/contacts/${cleanEmail(email)}`, {
      attributes: data.attributes || {},
      listIds: data.listIds || []
    });
  } catch (error: any) {
    console.error('Error updating contact:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to update contact');
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
    const response = await api.post('/smtp/email', {
      sender,
      to: to.map(email => ({ email: cleanEmail(email) })),
      templateId,
      params
    });
    return { messageId: response.data.messageId || '' };
  } catch (error: any) {
    console.error('Error sending email with template:', error);
    throw new Error(error.response?.data?.message || error.message || 'Failed to send email with template');
  }
}; 