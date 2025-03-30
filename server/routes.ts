import type { Express } from "express";
import { sendLeadNotification } from "./utils/slack";
import { sendEmailWithParams, createContactWithParams } from "./utils/brevo";
import { storage } from "./storage";

export function registerRoutes(app: Express) {
  // Test endpoint for database connection
  app.post("/api/test/create-user", async (req, res) => {
    try {
      const user = await storage.createUser({
        email: "test@example.com",
        name: "Test User"
      });
      res.json({ success: true, user });
    } catch (error: any) {
      console.error("Error creating test user:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Test endpoint for Slack notifications
  app.post("/api/test-slack", async (req, res) => {
    try {
      await sendLeadNotification({
        firstName: "Test User",
        email: "test@example.com",
        phone: "123-456-7890",
        question: "This is a test notification",
        marketingConsent: true,
        communicationConsent: true
      });
      
      return res.json({ 
        success: true,
        message: "Test Slack notification sent successfully"
      });
    } catch (error: any) {
      console.error("Slack test error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Error sending test notification",
        error: error.message 
      });
    }
  });

  // Test endpoint for Brevo email
  app.post("/api/test-brevo", async (req, res) => {
    try {
      // First create a test contact
      await createContactWithParams({
        email: process.env.CONTACT_EMAIL || 'contact@physiqfitness.com',
        firstName: 'Test',
        attributes: {
          COMPANY: 'Test Company',
          SOURCE: 'Website Test'
        }
      });

      // Then send a test email
      const response = await sendEmailWithParams({
        subject: 'Test Email from Brevo Integration',
        htmlContent: `
          <h2>Test Email</h2>
          <p>This is a test email to verify the Brevo integration is working correctly.</p>
          <p>Sent at: ${new Date().toISOString()}</p>
        `,
        to: [{ email: process.env.CONTACT_EMAIL || 'contact@physiqfitness.com' }]
      });
      
      return res.json({ 
        success: true,
        message: "Test contact created and email sent successfully",
        data: response
      });
    } catch (error: any) {
      console.error("Brevo test error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Error testing Brevo integration",
        error: error.message 
      });
    }
  });

  // Lead form submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, company, question, marketingConsent, communicationConsent } = req.body;

      if (!firstName || !email || !phone) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: firstName, email, and phone are required"
        });
      }
      
      // Create or update contact in Brevo
      await createContactWithParams({
        email,
        firstName,
        attributes: {
          LASTNAME: lastName || '',
          COMPANY: company || '',
          PHONE: phone,
          QUESTION: question || '',
          SOURCE: 'Website Lead Form',
          SIGNUP_DATE: new Date().toISOString(),
          MARKETING_CONSENT: marketingConsent || false,
          COMMUNICATION_CONSENT: communicationConsent || false
        }
      });

      // Send notification to Slack
      await sendLeadNotification({
        firstName,
        email,
        phone,
        question: question || `Company: ${company || 'Not provided'}`,
        marketingConsent: marketingConsent || false,
        communicationConsent: communicationConsent || false
      });

      // Send confirmation email only if they consented to communication
      if (communicationConsent) {
        await sendEmailWithParams({
          subject: 'Thank you for your interest in AdVelocity',
          htmlContent: `
            <h2>Thank you for reaching out!</h2>
            <p>Hi ${firstName},</p>
            <p>We have received your information and one of our experts will be in touch with you shortly.</p>
            ${question ? `<p>Your message:</p><blockquote>${question}</blockquote>` : ''}
            <p>Best regards,<br>The AdVelocity Team</p>
          `,
          to: [{ email, name: firstName }]
        });
      }
      
      return res.json({ 
        success: true,
        message: "Lead form submission successful"
      });
    } catch (error: any) {
      console.error("Lead form submission error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Error submitting lead form",
        error: error.message 
      });
    }
  });

  // Contact form submission endpoint
  app.post("/api/form", async (req, res) => {
    console.log('Form submission received:', {
      body: req.body,
      headers: req.headers,
      method: req.method
    });

    try {
      const { name, email, message, marketingConsent, communicationConsent } = req.body;
      console.log('Parsed form data:', { name, email, message, marketingConsent, communicationConsent });

      if (!name || !email || !message) {
        console.log('Validation failed:', { name, email, message });
        return res.status(400).json({
          success: false,
          message: "Missing required fields: name, email, and message are required"
        });
      }
      
      try {
        console.log('Creating/updating contact in Brevo...');
        // Create or update contact in Brevo
        await createContactWithParams({
          email,
          firstName: name,
          attributes: {
            LAST_MESSAGE: message,
            SOURCE: 'Website Form',
            SIGNUP_DATE: new Date().toISOString(),
            MARKETING_CONSENT: marketingConsent || false,
            COMMUNICATION_CONSENT: communicationConsent || false
          }
        });
        console.log('Contact created/updated successfully');
      } catch (error: any) {
        console.error("Error creating/updating contact:", {
          error: error.message,
          stack: error.stack,
          details: error.response?.body || error.message
        });
        // Continue with the form submission even if Brevo fails
      }

      try {
        console.log('Sending Slack notification...');
        // Send notification to Slack
        await sendLeadNotification({
          firstName: name,
          email,
          question: message,
          marketingConsent: marketingConsent || false,
          communicationConsent: communicationConsent || false
        });
        console.log('Slack notification sent successfully');
      } catch (error: any) {
        console.error("Error sending Slack notification:", {
          error: error.message,
          stack: error.stack,
          details: error.response?.body || error.message
        });
        // Continue with the form submission even if Slack fails
      }

      try {
        // Send confirmation email only if they consented to communication
        if (communicationConsent) {
          console.log('Sending confirmation email...');
          await sendEmailWithParams({
            subject: 'Thank you for contacting AdVelocity',
            htmlContent: `
              <h2>Thank you for reaching out!</h2>
              <p>Hi ${name},</p>
              <p>We have received your message and will get back to you shortly.</p>
              <p>Your message:</p>
              <blockquote>${message}</blockquote>
              <p>Best regards,<br>The AdVelocity Team</p>
            `,
            to: [{ email, name }]
          });
          console.log('Confirmation email sent successfully');
        } else {
          console.log('Skipping confirmation email - no communication consent');
        }
      } catch (error: any) {
        console.error("Error sending confirmation email:", {
          error: error.message,
          stack: error.stack,
          details: error.response?.body || error.message
        });
        // Continue with the form submission even if email fails
      }
      
      console.log('Form submission completed successfully');
      const response = { 
        success: true,
        message: "Form submission successful"
      };
      console.log('Sending response:', response);
      return res.json(response);
    } catch (error: any) {
      console.error("Form submission error:", {
        error: error.message,
        stack: error.stack,
        details: error.response?.body || error.message,
        body: req.body
      });
      const errorResponse = {
        success: false,
        message: error.message || "Error submitting form",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
      console.log('Sending error response:', errorResponse);
      return res.status(500).json(errorResponse);
    }
  });
}