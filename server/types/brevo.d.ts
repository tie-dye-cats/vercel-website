declare module '@getbrevo/brevo' {
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

  export function ApiClient(config: Configuration): ApiClient;
}

// Legacy module declaration for backward compatibility
declare module '@sendinblue/client' {
  export * from '@getbrevo/brevo';
}

export interface CreateContactParams {
  email: string;
  firstName?: string;
  lastName?: string;
  attributes?: Record<string, any>;
}

export interface SendEmailParams {
  subject: string;
  htmlContent: string;
  to: Array<{
    email: string;
    name?: string;
  }>;
} 