// Type definitions for Brevo API
export interface Contact {
  id?: number;
  email: string;
  firstName?: string;
  lastName?: string;
  attributes?: Record<string, any>;
}

export interface EmailParams {
  subject: string;
  htmlContent: string;
  to: Array<{
    email: string;
    name?: string;
  }>;
  sender?: {
    email: string;
    name: string;
  };
}

export interface BrevoError {
  response?: {
    body?: {
      message?: string;
    };
  };
  message?: string;
}

export interface ContactsApi {
  createContact(params: CreateContactParams): Promise<Contact>;
  getContactInfo(email: string): Promise<Contact>;
  updateContact(id: number, params: Partial<Contact>): Promise<Contact>;
}

export interface TransactionalEmailsApi {
  sendTransacEmail(params: EmailParams): Promise<any>;
}

export interface ApiClient {
  contactsApi: ContactsApi;
  transactionalEmailsApi: TransactionalEmailsApi;
}

export interface Configuration {
  apiKey: string;
  apiServer?: string;
}

export interface CreateContactParams {
  email: string;
  firstName?: string;
  lastName?: string;
  attributes?: Record<string, any>;
}

export interface SendEmailParams extends EmailParams {}

// Type for the ApiClient constructor function
export type ApiClientConstructor = (config: Configuration) => ApiClient; 