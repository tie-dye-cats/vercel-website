import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { TransactionalEmailsApi, ContactsApi } from '@getbrevo/brevo/dist/api/apis';
import { SendSmtpEmail, CreateContact, GetExtendedContactDetails, UpdateContact } from '@getbrevo/brevo/dist/model/models';
import { TransactionalEmailsApiApiKeys, ContactsApiApiKeys } from '@getbrevo/brevo/dist/api/apis';
import { IncomingMessage } from 'http';

// Mock the Brevo API classes
jest.mock('@getbrevo/brevo/dist/api/apis', () => ({
  TransactionalEmailsApi: jest.fn().mockImplementation(() => ({
    setApiKey: jest.fn(),
    sendTransacEmail: jest.fn(),
  })),
  ContactsApi: jest.fn().mockImplementation(() => ({
    setApiKey: jest.fn(),
    createContact: jest.fn(),
    getContactInfo: jest.fn(),
    updateContact: jest.fn(),
  })),
  TransactionalEmailsApiApiKeys: {
    apiKey: 'apiKey',
  },
  ContactsApiApiKeys: {
    apiKey: 'apiKey',
  },
}));

describe('Brevo Client', () => {
  let transactionalEmailsApi: jest.Mocked<TransactionalEmailsApi>;
  let contactsApi: jest.Mocked<ContactsApi>;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Initialize mocked instances
    transactionalEmailsApi = new TransactionalEmailsApi() as jest.Mocked<TransactionalEmailsApi>;
    contactsApi = new ContactsApi() as jest.Mocked<ContactsApi>;
  });

  describe('Email Sending', () => {
    it('should send a transactional email successfully', async () => {
      const mockResponse = {
        response: {} as IncomingMessage,
        body: { messageId: 'test-message-id' },
      };
      transactionalEmailsApi.sendTransacEmail.mockResolvedValueOnce(mockResponse);

      const email = new SendSmtpEmail();
      email.subject = 'Test Subject';
      email.htmlContent = '<p>Test Content</p>';
      email.sender = { name: 'Test Sender', email: 'sender@test.com' };
      email.to = [{ email: 'recipient@test.com', name: 'Test Recipient' }];

      const result = await transactionalEmailsApi.sendTransacEmail(email);

      expect(transactionalEmailsApi.sendTransacEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockResponse);
    });

    it('should handle email sending errors', async () => {
      const error = new Error('Failed to send email');
      transactionalEmailsApi.sendTransacEmail.mockRejectedValueOnce(error);

      const email = new SendSmtpEmail();
      email.subject = 'Test Subject';
      email.htmlContent = '<p>Test Content</p>';
      email.sender = { name: 'Test Sender', email: 'sender@test.com' };
      email.to = [{ email: 'recipient@test.com', name: 'Test Recipient' }];

      await expect(transactionalEmailsApi.sendTransacEmail(email)).rejects.toThrow('Failed to send email');
    });
  });

  describe('Contact Management', () => {
    it('should create a new contact successfully', async () => {
      const mockResponse = {
        response: {} as IncomingMessage,
        body: { id: 123 },
      };
      contactsApi.createContact.mockResolvedValueOnce(mockResponse);

      const contact = new CreateContact();
      contact.email = 'test@example.com';
      contact.attributes = {
        FIRSTNAME: 'John',
        LASTNAME: 'Doe',
      };

      const result = await contactsApi.createContact(contact);

      expect(contactsApi.createContact).toHaveBeenCalledWith(contact);
      expect(result).toEqual(mockResponse);
    });

    it('should get contact information successfully', async () => {
      const mockResponse = {
        response: {} as IncomingMessage,
        body: new GetExtendedContactDetails(),
      };
      mockResponse.body.id = 123;
      mockResponse.body.email = 'test@example.com';
      mockResponse.body.attributes = {
        FIRSTNAME: 'John',
        LASTNAME: 'Doe',
      };

      contactsApi.getContactInfo.mockResolvedValueOnce(mockResponse);

      const result = await contactsApi.getContactInfo('test@example.com');

      expect(contactsApi.getContactInfo).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(mockResponse);
    });

    it('should update contact information successfully', async () => {
      const mockResponse = {
        response: {} as IncomingMessage,
        body: { id: 123 },
      };
      contactsApi.updateContact.mockResolvedValueOnce(mockResponse);

      const email = 'test@example.com';
      const updateContact = new UpdateContact();
      updateContact.attributes = {
        FIRSTNAME: 'Jane',
        LASTNAME: 'Doe',
      };

      const result = await contactsApi.updateContact(email, updateContact);

      expect(contactsApi.updateContact).toHaveBeenCalledWith(email, updateContact);
      expect(result).toEqual(mockResponse);
    });

    it('should handle contact management errors', async () => {
      const error = new Error('Failed to manage contact');
      contactsApi.createContact.mockRejectedValueOnce(error);

      const contact = new CreateContact();
      contact.email = 'test@example.com';
      contact.attributes = {
        FIRSTNAME: 'John',
        LASTNAME: 'Doe',
      };

      await expect(contactsApi.createContact(contact)).rejects.toThrow('Failed to manage contact');
    });
  });
}); 