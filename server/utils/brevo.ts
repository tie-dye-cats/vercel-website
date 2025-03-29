import { TransactionalEmailsApi, ContactsApi, TransactionalEmailsApiApiKeys, ContactsApiApiKeys } from '@getbrevo/brevo/dist/api';
import { SendSmtpEmail, CreateContact } from '@getbrevo/brevo/dist/model';

const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

export const CONTACT_LISTS = {
  WEBSITE_LEADS: 2
};

export async function sendEmail(params: {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  sender?: { name: string; email: string };
}) {
  if (!process.env.BREVO_API_KEY) {
    console.warn('BREVO_API_KEY not configured. Email notifications will be disabled.');
    return;
  }

  const sendSmtpEmail = new SendSmtpEmail();
  
  sendSmtpEmail.subject = params.subject;
  sendSmtpEmail.htmlContent = params.htmlContent;
  sendSmtpEmail.sender = params.sender || {
    name: "Physiq Fitness Website",
    email: "noreply@physiqfitness.com"
  };
  sendSmtpEmail.to = params.to;

  try {
    console.log('Sending email with params:', {
      subject: params.subject,
      to: params.to,
      from: sendSmtpEmail.sender,
      apiKeyPresent: !!process.env.BREVO_API_KEY
    });

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export async function createContact(params: {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  listIds?: number[];
}) {
  if (!process.env.BREVO_API_KEY) {
    console.warn('BREVO_API_KEY not configured. Contact creation will be disabled.');
    return;
  }

  const contactsApi = new ContactsApi();
  contactsApi.setApiKey(ContactsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

  const createContact = new CreateContact();

  createContact.email = params.email;
  createContact.attributes = {
    FIRSTNAME: params.firstName || '',
    LASTNAME: params.lastName || '',
    SMS: params.phone || ''
  };
  createContact.listIds = params.listIds || [CONTACT_LISTS.WEBSITE_LEADS];
  createContact.updateEnabled = true;

  try {
    console.log('Creating/updating contact:', params);
    const response = await contactsApi.createContact(createContact);
    console.log('Contact created/updated successfully:', response);
    return response;
  } catch (error: any) {
    // Handle duplicate contacts gracefully
    if (error.response?.body?.code === 'duplicate_parameter') {
      console.log('Contact already exists, this is fine:', error.response.body);
      return error.response.body;
    }
    console.error('Failed to create/update contact:', error);
    throw error;
  }
} 