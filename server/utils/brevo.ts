import * as SibApiV3Sdk from '@sendinblue/client';

// Initialize Brevo API client
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const contactsApi = new SibApiV3Sdk.ContactsApi();

// Set API key
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');
contactsApi.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

// List IDs for different contact types
const CONTACT_LISTS = {
  WEBSITE_LEADS: 2  // Replace with your actual list ID from Brevo
};

interface EmailParams {
  subject: string;
  htmlContent: string;
  to: Array<{ email: string; name?: string }>;
}

export async function createContact(params: { 
  email: string; 
  firstName?: string;
  phone?: string;
  attributes?: Record<string, any>;
}) {
  if (!process.env.BREVO_API_KEY) {
    console.log("Brevo contact creation disabled - no BREVO_API_KEY configured");
    return;
  }

  try {
    // Create contact
    const createContact = new SibApiV3Sdk.CreateContact();
    createContact.email = params.email;
    createContact.attributes = {
      FIRSTNAME: params.firstName || '',
      SMS: params.phone || '',
      ...params.attributes
    };
    createContact.listIds = [CONTACT_LISTS.WEBSITE_LEADS];
    createContact.updateEnabled = true; // Update contact if it already exists

    const response = await contactsApi.createContact(createContact);
    console.log('Contact created/updated in Brevo:', response);
    return response;
  } catch (error: any) {
    // If contact already exists, try to update their list membership
    if (error.response?.body?.code === 'duplicate_parameter') {
      try {
        console.log('Contact already exists, updating list membership:', params.email);
        await contactsApi.addContactToList(CONTACT_LISTS.WEBSITE_LEADS, { emails: [params.email] });
        return null;
      } catch (listError) {
        console.error('Error adding contact to list:', listError);
        throw listError;
      }
    }
    throw error;
  }
}

export async function sendEmail(params: EmailParams) {
  if (!process.env.BREVO_API_KEY) {
    console.log("Brevo notifications disabled - no BREVO_API_KEY configured");
    return;
  }

  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = params.subject;
    sendSmtpEmail.htmlContent = params.htmlContent;
    sendSmtpEmail.sender = { 
      name: 'Physiq Fitness Website', 
      email: 'noreply@physiqfitness.com' 
    };
    sendSmtpEmail.to = params.to;

    console.log('Sending email with params:', {
      subject: params.subject,
      to: params.to,
      from: sendSmtpEmail.sender
    });

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
} 