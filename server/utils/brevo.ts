const BREVO_API_URL = 'https://api.brevo.com/v3';

export const CONTACT_LISTS = {
  WEBSITE_LEADS: 2
};

export interface CreateContactParams {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  listId?: number;
  attributes?: Record<string, string>;
}

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

  try {
    console.log('Sending email with params:', {
      subject: params.subject,
      to: params.to,
      from: params.sender,
      apiKeyPresent: !!process.env.BREVO_API_KEY
    });

    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        subject: params.subject,
        htmlContent: params.htmlContent,
        sender: params.sender || {
          name: "Physiq Fitness Website",
          email: "noreply@physiqfitness.com"
        },
        to: params.to
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export async function createContact(params: CreateContactParams): Promise<any> {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY environment variable is not set');
  }

  try {
    // First try to create the contact
    const response = await fetch(`${BREVO_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify(params)
    });

    // If creation fails due to duplicate email, try to update instead
    if (response.status === 400) {
      const error = await response.json();
      if (error.message?.includes('already exists')) {
        // Get the contact ID first
        const getResponse = await fetch(`${BREVO_API_URL}/contacts/${params.email}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY
          }
        });
        
        if (!getResponse.ok) {
          throw new Error('Failed to retrieve existing contact');
        }

        const existingContact = await getResponse.json();
        
        // Update the existing contact
        const updateResponse = await fetch(`${BREVO_API_URL}/contacts/${existingContact.id}`, {
          method: 'PUT',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'api-key': process.env.BREVO_API_KEY
          },
          body: JSON.stringify({
            ...params,
            attributes: {
              ...existingContact.attributes,
              ...params.attributes
            }
          })
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update existing contact');
        }

        return existingContact;
      }
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create contact');
    }

    return await response.json();
  } catch (error) {
    console.error('Error handling contact:', error);
    throw error;
  }
} 