declare module '@getbrevo/brevo' {
  export class TransactionalEmailsApi {
    setApiKey(key: string, value: string): void;
    sendTransacEmail(email: SendSmtpEmail): Promise<any>;
  }

  export class ContactsApi {
    setApiKey(key: string, value: string): void;
    createContact(contact: CreateContact): Promise<any>;
  }

  export enum TransactionalEmailsApiApiKeys {
    apiKey = 'api-key'
  }

  export enum ContactsApiApiKeys {
    apiKey = 'api-key'
  }

  export class SendSmtpEmail {
    subject?: string;
    htmlContent?: string;
    sender?: { name: string; email: string };
    to?: { email: string; name?: string }[];
  }

  export class CreateContact {
    email?: string;
    attributes?: Record<string, string>;
    listIds?: number[];
    updateEnabled?: boolean;
  }

  export interface Contact {
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

  export interface ApiClient {
    accountApi: any;
    contactsApi: any;
    emailCampaignsApi: any;
    transactionalEmailsApi: any;
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