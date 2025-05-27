import { 
  ContactsApi, 
  ContactsApiApiKeys,
  TransactionalEmailsApi, 
  TransactionalEmailsApiApiKeys,
  CreateContact, 
  SendSmtpEmail, 
  UpdateContact
} from '@getbrevo/brevo'
import { CreateContactParams, SendEmailParams, BrevoError } from './brevo.types'

export class BrevoService {
  private contactsApi: ContactsApi
  private transactionalEmailsApi: TransactionalEmailsApi
  private defaultListId: number

  constructor(apiKey: string, defaultListId: number = 1) {
    // Initialize API instances with API key
    this.contactsApi = new ContactsApi()
    this.contactsApi.setApiKey(ContactsApiApiKeys.apiKey, apiKey)
    
    this.transactionalEmailsApi = new TransactionalEmailsApi()
    this.transactionalEmailsApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey)
    
    this.defaultListId = defaultListId
  }

  /**
   * Create a new contact in Brevo
   */
  async createContact(params: CreateContactParams): Promise<{ success: boolean; contactId?: string; error?: string }> {
    try {
      const createContact = new CreateContact()
      createContact.email = params.email
      
      // Set attributes
      const attributes: any = {
        FIRSTNAME: params.firstName || '',
        LASTNAME: params.lastName || '',
        ...params.attributes
      }
      
      // Add SMS/phone if provided in E.164 format (+CCXXXXXXXXXX)
      if (params.SMS && params.SMS.startsWith('+') && params.SMS.length >= 10) {
        // Validate E.164 format: starts with + and contains only digits after
        const phoneRegex = /^\+[1-9]\d{1,14}$/
        if (phoneRegex.test(params.SMS)) {
          attributes.SMS = params.SMS
        }
      }
      
      createContact.attributes = attributes

      // Set list IDs
      createContact.listIds = params.listIds || [this.defaultListId]

      const result = await this.contactsApi.createContact(createContact)
      
      return {
        success: true,
        contactId: result.body?.id?.toString()
      }
    } catch (error: any) {
      console.error('Brevo createContact error:', error)
      
      // Handle duplicate contact error gracefully
      if (error.response?.body?.code === 'duplicate_parameter') {
        return {
          success: true,
          error: 'Contact already exists'
        }
      }

      return {
        success: false,
        error: error.response?.body?.message || error.message || 'Unknown error'
      }
    }
  }

  /**
   * Send a transactional email
   */
  async sendEmail(params: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const sendSmtpEmail = new SendSmtpEmail()
      sendSmtpEmail.to = params.to
      sendSmtpEmail.subject = params.subject
      sendSmtpEmail.htmlContent = params.htmlContent
      
      if (params.textContent) {
        sendSmtpEmail.textContent = params.textContent
      }

      if (params.params) {
        sendSmtpEmail.params = params.params
      }

      if (params.tags) {
        sendSmtpEmail.tags = params.tags
      }

      const result = await this.transactionalEmailsApi.sendTransacEmail(sendSmtpEmail)
      
      return {
        success: true,
        messageId: result.body?.messageId
      }
    } catch (error: any) {
      console.error('Brevo sendEmail error:', error)
      
      return {
        success: false,
        error: error.response?.body?.message || error.message || 'Unknown error'
      }
    }
  }

  /**
   * Get contact information by email
   */
  async getContact(email: string): Promise<{ success: boolean; contact?: any; error?: string }> {
    try {
      const result = await this.contactsApi.getContactInfo(email)
      
      return {
        success: true,
        contact: result.body
      }
    } catch (error: any) {
      console.error('Brevo getContact error:', error)
      
      return {
        success: false,
        error: error.response?.body?.message || error.message || 'Unknown error'
      }
    }
  }

  /**
   * Update an existing contact
   */
  async updateContact(email: string, params: Partial<CreateContactParams>): Promise<{ success: boolean; error?: string }> {
    try {
      const updateContact = new UpdateContact()
      
      if (params.attributes) {
        updateContact.attributes = params.attributes
      }

      if (params.listIds) {
        updateContact.listIds = params.listIds
      }

      await this.contactsApi.updateContact(email, updateContact)
      
      return { success: true }
    } catch (error: any) {
      console.error('Brevo updateContact error:', error)
      
      return {
        success: false,
        error: error.response?.body?.message || error.message || 'Unknown error'
      }
    }
  }
} 