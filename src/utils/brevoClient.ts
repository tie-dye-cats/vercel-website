import { TransactionalEmailsApi, ContactsApi } from '@getbrevo/brevo/dist/api/apis';
import { SendSmtpEmail, CreateContact } from '@getbrevo/brevo/dist/model/models';
import { TransactionalEmailsApiApiKeys, ContactsApiApiKeys } from '@getbrevo/brevo/dist/api/apis';

// Initialize API instances
const transactionalEmailsApi = new TransactionalEmailsApi();
const contactsApi = new ContactsApi();

// Set API keys
const apiKey = process.env.BREVO_API_KEY;
if (!apiKey) {
  throw new Error('BREVO_API_KEY environment variable is not set');
}

transactionalEmailsApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);
contactsApi.setApiKey(ContactsApiApiKeys.apiKey, apiKey);

// Retry logic for handling rate limits
const sendWithRetry = async (fn: () => Promise<any>, maxRetries = 3, delay = 1000) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error: any) {
      if (error.response?.status === 429) {
        // Rate limit hit, wait and retry
        retries++;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, retries)));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Maximum retries reached');
};

// Contact management functions
export async function createOrUpdateContact(params: {
  email: string;
  firstName: string;
  attributes: Record<string, any>;
}) {
  try {
    const contactData: CreateContact = {
      email: params.email,
      attributes: {
        FIRSTNAME: params.firstName,
        ...params.attributes
      },
      updateEnabled: true // Allow updating existing contacts
    };

    return await sendWithRetry(() => contactsApi.createContact(contactData));
  } catch (error: any) {
    console.error('Error creating/updating contact:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
}

// Email sending functions
export async function sendTransactionalEmail(params: {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  params?: Record<string, any>;
}) {
  try {
    const emailData: SendSmtpEmail = {
      sender: { 
        email: process.env.EMAIL_FROM || 'noreply@advelocity.ai',
        name: 'AdVelocity'
      },
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
      params: params.params
    };

    return await sendWithRetry(() => transactionalEmailsApi.sendTransacEmail(emailData));
  } catch (error: any) {
    console.error('Error sending email:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
}

// Email templates
export const emailTemplates = {
  welcomeTemplate: (name: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thank you for reaching out!</h2>
      <p>Hi ${name},</p>
      <p>We have received your information and one of our experts will be in touch with you shortly.</p>
      <p>Best regards,<br>The AdVelocity Team</p>
    </div>
  `,

  contactFormTemplate: (name: string, message: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thank you for your message!</h2>
      <p>Hi ${name},</p>
      <p>We have received your message and will get back to you shortly.</p>
      ${message ? `<p>Your message:</p><blockquote>${message}</blockquote>` : ''}
      <p>Best regards,<br>The AdVelocity Team</p>
    </div>
  `
}; 