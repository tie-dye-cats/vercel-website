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
  message: string;
  response?: {
    body?: {
      message?: string;
    };
  };
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
  listIds?: number[];
}

export interface SendEmailParams {
  to: Array<{ email: string; name?: string }>;
  subject: string;
  htmlContent: string;
  textContent?: string;
  params?: Record<string, any>;
  tags?: string[];
}

declare module '@getbrevo/brevo' {
  export interface BrevoContactResponse {
    id: string;
    email: string;
    createdAt: string;
    attributes: {
      FIRSTNAME?: string;
      LASTNAME?: string;
      [key: string]: any;
    };
  }

  export interface BrevoEmailResponse {
    messageId: string;
    envelope: {
      from: string;
      to: string[];
    };
    acceptedAt?: string;
  }

  export interface BrevoError {
    response?: {
      body?: {
        message?: string;
        [key: string]: any;
      };
    };
    message?: string;
  }

  export interface CreateContactParams {
    email: string;
    attributes?: Record<string, any>;
    listIds?: number[];
  }

  export interface SendEmailParams {
    to: Array<{
      email: string;
      name?: string;
    }>;
    subject: string;
    htmlContent: string;
    sender?: {
      name: string;
      email: string;
    };
  }
} 