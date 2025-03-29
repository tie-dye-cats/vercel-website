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
} 