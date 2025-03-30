import type { BrevoError, CreateContactParams, SendEmailParams } from '../types/brevo';
import { createContact, sendEmail, contactsApi } from './brevoClient';
import type { EmailResponse, ContactResponse } from './brevoClient';
import { GetExtendedContactDetails } from '@getbrevo/brevo/dist/model/models';

export { createContact, sendEmail };

export const CONTACT_LISTS = {
  WEBSITE_LEADS: 2
};

export async function sendEmailWithParams(params: SendEmailParams): Promise<EmailResponse> {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY environment variable is not set');
  }

  try {
    const response = await sendEmail(
      [params.to[0].email],
      params.subject,
      params.htmlContent
    );
    return response;
  } catch (error) {
    const brevoError = error as BrevoError;
    console.error('Error sending email:', error);
    throw new Error(brevoError.message || 'Failed to send email');
  }
}

export async function createContactWithParams(params: CreateContactParams): Promise<ContactResponse> {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY environment variable is not set');
  }

  try {
    const response = await createContact(params.email, params.attributes || {});
    return response;
  } catch (error) {
    const brevoError = error as BrevoError;
    if (brevoError.response?.body?.message?.includes('already exists')) {
      try {
        // Get existing contact
        const existingContact = await contactsApi.getContactInfo(params.email);
        
        if (!existingContact || !existingContact.body) {
          throw new Error('Failed to retrieve existing contact details');
        }

        // Update contact
        const updateResponse = await contactsApi.updateContact(params.email, {
          attributes: {
            ...(existingContact.body.attributes || {}),
            ...params.attributes
          }
        });

        return { id: existingContact.body.id };
      } catch (updateError) {
        console.error('Error updating existing contact:', updateError);
        throw new Error('Failed to update existing contact');
      }
    }
    throw new Error(brevoError.message || 'Failed to create contact');
  }
} 