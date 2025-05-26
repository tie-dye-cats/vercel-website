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
    // Validate phone number if provided in attributes
    if (params.attributes?.SMS) {
      console.log('Validating phone number:', params.attributes.SMS);
      // Ensure SMS attribute is not truncated by stringifying and validating length
      if (typeof params.attributes.SMS === 'string' && params.attributes.SMS.length < 10) {
        throw new Error(`Invalid phone number format: ${params.attributes.SMS} (too short)`);
      }
    }
    
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
    
    console.log('Calling createDoiContact for:', params.email);
    try {
      await createDoiContact(params.email, contactData);
      console.log('Successfully called createDoiContact for:', params.email);
    } catch (doiError: any) {
      console.error('Error during createDoiContact:', doiError);
      
      // Check for specific error conditions
      if (doiError.message?.includes('phone') || doiError.response?.body?.message?.includes('phone')) {
        throw new Error('Invalid phone number format. Please ensure you provide a valid phone number.');
      }
      
      // Re-throw other errors
      throw doiError;
    }
    
    // DOI contact creation doesn't return an ID immediately
    return { id: 0 };
  } catch (error: any) {
    // Handle duplicate contacts
    if (error.body?.code === 'duplicate_parameter' || error.message?.includes('already associated')) {
      try {
        console.log('Contact already exists, updating instead:', params.email);
        const existingContact = await contactsApi.getContactInfo(params.email);
        
        if (!existingContact || !existingContact.body) {
          throw new Error('Failed to retrieve existing contact details');
        }

        const updatedAttributes = {
          ...existingContact.body.attributes || {},
          ...params.attributes,
          FIRSTNAME: params.firstName || params.email.split('@')[0]
        };

        // Validate phone number in updatedAttributes as well
        if (updatedAttributes.SMS && typeof updatedAttributes.SMS === 'string' && updatedAttributes.SMS.length < 10) {
          throw new Error(`Invalid phone number format: ${updatedAttributes.SMS} (too short)`);
        }

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
    
    // Log more detailed error information
    console.error('Brevo API error:', {
      message: error.message,
      stack: error.stack,
      responseBody: error.response?.body,
      responseStatus: error.response?.statusCode
    });
    
    // Provide more specific error messages based on the error type
    if (error.message?.includes('phone') || error.response?.body?.message?.includes('phone')) {
      throw new Error('Invalid phone number format. Please provide a valid phone number with country code (e.g., +1 for US).');
    }
    
    throw new Error(error.message || 'Failed to create contact');
  }
} 