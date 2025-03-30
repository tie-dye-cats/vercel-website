import SibApiV3Sdk from 'sib-api-v3-sdk';

// Initialize the Brevo API client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY || '';

// Create API instances
const accountApi = new SibApiV3Sdk.AccountApi();
const contactsApi = new SibApiV3Sdk.ContactsApi();

export const brevoClient = {
  // Get account information
  getAccount: async () => {
    return await accountApi.getAccount();
  },

  // Create or update a contact
  createContact: async (contact: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    company?: string;
    attributes?: Record<string, any>;
  }) => {
    const createContact = new SibApiV3Sdk.CreateContact();
    createContact.email = contact.email;
    createContact.firstName = contact.firstName;
    createContact.lastName = contact.lastName;
    createContact.phone = contact.phone;
    createContact.company = contact.company;
    createContact.attributes = contact.attributes;

    return await contactsApi.createContact(createContact);
  },

  // Get contact by email
  getContact: async (email: string) => {
    return await contactsApi.getContactInfo(email);
  },

  // Update contact
  updateContact: async (email: string, contact: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    company?: string;
    attributes?: Record<string, any>;
  }) => {
    const updateContact = new SibApiV3Sdk.UpdateContact();
    updateContact.firstName = contact.firstName;
    updateContact.lastName = contact.lastName;
    updateContact.phone = contact.phone;
    updateContact.company = contact.company;
    updateContact.attributes = contact.attributes;

    return await contactsApi.updateContact(email, updateContact);
  }
}; 