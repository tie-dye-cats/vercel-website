declare module '@getbrevo/brevo' {
  export default class Brevo {
    constructor(config: { apiKey: string });
    contactsApi: {
      createContact(params: any): Promise<any>;
      getContactInfo(email: string): Promise<any>;
      updateContact(id: number, params: any): Promise<any>;
    };
    transactionalEmailsApi: {
      sendTransacEmail(params: any): Promise<any>;
    };
  }
} 