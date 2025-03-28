import type { Express } from "express";
import { sendLeadNotification } from "./utils/slack";
import { sendEmail, createContact } from "./utils/brevo";

export function registerRoutes(app: Express) {
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
      await createContact({
        email: process.env.CONTACT_EMAIL || 'contact@physiqfitness.com',
        firstName: 'Test',
        attributes: {
          COMPANY: 'Test Company',
          SOURCE: 'Website Test'
        }
      });

      // Then send a test email
      const response = await sendEmail({
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
      const { firstName, lastName, email, phone, company } = req.body;

      if (!firstName || !email || !phone) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: firstName, email, and phone are required"
        });
      }
      
      // Create or update contact in Brevo
      await createContact({
        email,
        firstName,
        attributes: {
          LASTNAME: lastName || '',
          COMPANY: company || '',
          PHONE: phone,
          SOURCE: 'Website Lead Form',
          SIGNUP_DATE: new Date().toISOString()
        }
      });

      // Send notification to Slack
      await sendLeadNotification({
        firstName,
        email,
        phone,
        question: `Company: ${company || 'Not provided'}`
      });

      // Send confirmation email
      await sendEmail({
        subject: 'Thank you for your interest in Physiq Fitness',
        htmlContent: `
          <h2>Thank you for reaching out!</h2>
          <p>Hi ${firstName},</p>
          <p>We have received your information and one of our experts will be in touch with you shortly.</p>
          <p>Best regards,<br>The Physiq Fitness Team</p>
        `,
        to: [{ email, name: firstName }]
      });
      
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
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: name, email, and message are required"
        });
      }
      
      // Create or update contact in Brevo
      await createContact({
        email,
        firstName: name,
        attributes: {
          LAST_MESSAGE: message,
          SOURCE: 'Website Form',
          SIGNUP_DATE: new Date().toISOString()
        }
      });

      // Send notification to Slack
      await sendLeadNotification({
        firstName: name,
        email,
        question: message
      });

      // Send confirmation email
      await sendEmail({
        subject: 'Thank you for contacting Physiq Fitness',
        htmlContent: `
          <h2>Thank you for reaching out!</h2>
          <p>Hi ${name},</p>
          <p>We have received your message and will get back to you shortly.</p>
          <p>Your message:</p>
          <blockquote>${message}</blockquote>
          <p>Best regards,<br>The Physiq Fitness Team</p>
        `,
        to: [{ email, name }]
      });
      
      return res.json({ 
        success: true,
        message: "Form submission successful"
      });
    } catch (error: any) {
      console.error("Form submission error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Error submitting form",
        error: error.message 
      });
    }
  });
}