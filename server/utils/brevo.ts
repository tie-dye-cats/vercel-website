import type { BrevoError, CreateContactParams, SendEmailParams } from '../types/brevo';
import { createDoiContact, sendEmail, contactsApi } from './brevoClient';
import type { EmailResponse, ContactResponse } from './brevoClient';
import { GetExtendedContactDetails } from '@getbrevo/brevo/dist/model/models';

export { createDoiContact as createContact, sendEmail };

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
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new Error(error.message || 'Failed to send email');
  }
}

export async function createContactWithParams(params: CreateContactParams): Promise<ContactResponse> {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY environment variable is not set');
  }

  try {
    const contactData = {
      email: params.email,
      attributes: {
        ...params.attributes,
        FIRSTNAME: params.firstName || params.email.split('@')[0]
      },
      listIds: [2], // WEBSITE_LEADS list ID
      templateId: 1,
      redirectionUrl: "https://physiqfitness.com"
    };
    await createDoiContact(params.email, contactData);
    // DOI contact creation doesn't return an ID immediately
    return { id: 0 };
  } catch (error: any) {
    if (error.body?.code === 'duplicate_parameter' || error.message?.includes('already associated')) {
      try {
        const existingContact = await contactsApi.getContactInfo(params.email);
        
        if (!existingContact || !existingContact.body) {
          throw new Error('Failed to retrieve existing contact details');
        }

        const updatedAttributes = {
          ...existingContact.body.attributes || {},
          ...params.attributes,
          FIRSTNAME: params.firstName || params.email.split('@')[0]
        };

        await contactsApi.updateContact(params.email, {
          attributes: updatedAttributes,
          listIds: [2]
        });

        const result = { id: existingContact.body.id };
        return result;
      } catch (updateError: any) {
        console.error('Error updating existing contact:', updateError);
        throw new Error(updateError.message || 'Failed to update existing contact');
      }
    }
    console.error('Brevo API error:', error);
    throw new Error(error.message || 'Failed to create contact');
  }
} 