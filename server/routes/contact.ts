import { Router } from 'express';
import * as SibApiV3Sdk from '@sendinblue/client';

const router = Router();

// Initialize Brevo API client
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Create email parameters
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = 'New Contact Form Submission';
    sendSmtpEmail.htmlContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;
    sendSmtpEmail.sender = { name: 'Physiq Fitness Website', email: 'noreply@physiqfitness.com' };
    sendSmtpEmail.to = [{ email: process.env.CONTACT_EMAIL || 'contact@physiqfitness.com' }];

    // Send email using Brevo
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    res.json({ 
      success: true, 
      message: 'Message sent successfully',
      data: response
    });
  } catch (error) {
    console.error('Error sending contact form:', error);
    res.status(500).json({ 
      error: 'Failed to send message',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 