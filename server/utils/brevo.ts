import * as SibApiV3Sdk from '@sendinblue/client';

// Initialize Brevo API key
const BREVO_API_KEY = process.env.BREVO_API_KEY;

// Initialize API instances with API key
const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();
const contactsApi = new SibApiV3Sdk.ContactsApi();

// Set API key for both instances
if (BREVO_API_KEY) {
  transactionalEmailsApi.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, BREVO_API_KEY);
  contactsApi.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, BREVO_API_KEY);
} else {
  console.warn('Warning: BREVO_API_KEY not configured. Email and contact features will be disabled.');
}

// Define list IDs (replace with your actual list IDs)
export const CONTACT_LISTS = {
  WEBSITE_LEADS: 2, // Replace with your actual list ID
  NEWSLETTER: 3,    // Replace with your actual list ID
};

export async function createContact({
  email,
  firstName,
  attributes = {}
}: {
  email: string;
  firstName: string;
  attributes?: Record<string, any>;
}) {
  if (!BREVO_API_KEY) {
    console.warn('Warning: BREVO_API_KEY not configured. Contact creation disabled.');
    return;
  }

  try {
    // Clean input data
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanFirstName = String(firstName).trim();

    // Create contact object
    const createContact = new SibApiV3Sdk.CreateContact();
    createContact.email = cleanEmail;
    createContact.attributes = {
      FIRSTNAME: cleanFirstName,
      ...attributes,
      SIGNUP_DATE: new Date().toISOString()
    };
    createContact.listIds = [CONTACT_LISTS.WEBSITE_LEADS];

    console.log('Creating contact with data:', {
      email: cleanEmail,
      attributes: createContact.attributes,
      listIds: createContact.listIds
    });

    // Attempt to create contact
    try {
      const data = await contactsApi.createContact(createContact);
      console.log('Contact created successfully:', data);
      return data;
    } catch (error: any) {
      // If contact already exists (duplicate), try updating instead
      if (error.response?.body?.code === 'duplicate_parameter') {
        console.log('Contact already exists, updating...');
        const updateContact = new SibApiV3Sdk.UpdateContact();
        updateContact.attributes = createContact.attributes;
        updateContact.listIds = createContact.listIds;
        
        const data = await contactsApi.updateContact(cleanEmail, updateContact);
        console.log('Contact updated successfully:', data);
        return data;
      }
      throw error; // Re-throw if it's not a duplicate error
    }
  } catch (error: any) {
    console.error('Error in createContact:', {
      message: error.message,
      response: error.response?.body,
      stack: error.stack
    });
    throw new Error(`Failed to create/update contact: ${error.message}`);
  }
}

export async function sendEmail({
  subject,
  htmlContent,
  to,
}: {
  subject: string;
  htmlContent: string;
  to: Array<{ email: string; name?: string }>;
}) {
  if (!BREVO_API_KEY) {
    console.warn('Warning: BREVO_API_KEY not configured. Email sending disabled.');
    return;
  }

  try {
    // Clean input data
    const cleanTo = to.map(recipient => ({
      email: String(recipient.email).trim().toLowerCase(),
      name: recipient.name ? String(recipient.name).trim() : undefined
    }));

    // Create email object
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = {
      name: 'Physiq Fitness Website',
      email: 'noreply@physiqfitness.com'
    };
    sendSmtpEmail.to = cleanTo;

    console.log('Sending email with params:', {
      subject,
      to: cleanTo,
      from: sendSmtpEmail.sender,
      apiKeyPresent: !!BREVO_API_KEY
    });

    // Send email
    const data = await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully:', data);
    return data;
  } catch (error: any) {
    console.error('Error in sendEmail:', {
      message: error.message,
      response: error.response?.body,
      stack: error.stack
    });
    throw new Error(`Failed to send email: ${error.message}`);
  }
} 