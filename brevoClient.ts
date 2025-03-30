import { TransactionalEmailsApi, ContactsApi } from '@getbrevo/brevo/dist/api/apis';
import { SendSmtpEmail, CreateContact, GetExtendedContactDetails } from '@getbrevo/brevo/dist/model/models';
import { TransactionalEmailsApiApiKeys } from '@getbrevo/brevo/dist/api/transactionalEmailsApi';
import { ContactsApiApiKeys } from '@getbrevo/brevo/dist/api/contactsApi';

// Initialize API instances
const transactionalEmailsApi = new TransactionalEmailsApi();
const contactsApi = new ContactsApi();

// Set API key for both instances
transactionalEmailsApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');
contactsApi.setApiKey(ContactsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

// Response interfaces
interface EmailResponse {
  messageId: string;
}

interface ContactResponse {
  id: number;
}

interface ContactInfoResponse {
  email: string;
  id: number;
  emailBlacklisted: boolean;
  smsBlacklisted: boolean;
  modifiedAt: string;
  createdAt: string;
  attributes: Record<string, any>;
}

// Utility function to clean email addresses
function cleanEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Send a transactional email
export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  params?: Record<string, any>
): Promise<EmailResponse> {
  try {
    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.to = [{ email: cleanEmail(to) }];
    if (params) {
      sendSmtpEmail.params = params;
    }

    const data = await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
    if (!data.body.messageId) {
      throw new Error('No message ID returned from API');
    }
    return { messageId: data.body.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Create a new contact
export async function createContact(
  email: string,
  attributes?: Record<string, any>
): Promise<ContactResponse> {
  try {
    const createContact = new CreateContact();
    createContact.email = cleanEmail(email);
    if (attributes) {
      createContact.attributes = attributes;
    }

    const data = await contactsApi.createContact(createContact);
    if (!data.body.id) {
      throw new Error('No contact ID returned from API');
    }
    return { id: data.body.id };
  } catch (error) {
    console.error('Error creating contact:', error);
    throw error;
  }
}

// Get contact information
export async function getContactInfo(email: string): Promise<ContactInfoResponse | null> {
  try {
    const data = await contactsApi.getContactInfo(cleanEmail(email));
    const contactDetails = data.body;
    if (!contactDetails.email || !contactDetails.id) {
      throw new Error('Invalid contact details returned from API');
    }
    return {
      email: contactDetails.email,
      id: contactDetails.id,
      emailBlacklisted: contactDetails.emailBlacklisted || false,
      smsBlacklisted: contactDetails.smsBlacklisted || false,
      modifiedAt: contactDetails.modifiedAt || new Date().toISOString(),
      createdAt: contactDetails.createdAt || new Date().toISOString(),
      attributes: contactDetails.attributes || {}
    };
  } catch (error) {
    if ((error as any).status === 404) {
      return null;
    }
    console.error('Error getting contact info:', error);
    throw error;
  }
}

// Update contact
export async function updateContact(
  email: string,
  attributes: Record<string, any>
): Promise<void> {
  try {
    await contactsApi.updateContact(cleanEmail(email), { attributes });
  } catch (error) {
    console.error('Error updating contact:', error);
    throw error;
  }
}

// Send email with template
export async function sendEmailWithTemplate(
  to: string,
  templateId: number,
  params?: Record<string, any>
): Promise<EmailResponse> {
  try {
    const sendSmtpEmail = new SendSmtpEmail();
    sendSmtpEmail.to = [{ email: cleanEmail(to) }];
    sendSmtpEmail.templateId = templateId;
    if (params) {
      sendSmtpEmail.params = params;
    }

    const data = await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
    if (!data.body.messageId) {
      throw new Error('No message ID returned from API');
    }
    return { messageId: data.body.messageId };
  } catch (error) {
    console.error('Error sending email with template:', error);
    throw error;
  }
} 