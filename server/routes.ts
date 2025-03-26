import type { Express } from "express";
import { sendLeadNotification } from "./utils/slack";
import { sendEmail } from "./utils/brevo";

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
      
      return res.status(200).json({ 
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
      const response = await sendEmail({
        subject: 'Test Email from Brevo Integration',
        htmlContent: `
          <h2>Test Email</h2>
          <p>This is a test email to verify the Brevo integration is working correctly.</p>
          <p>Sent at: ${new Date().toISOString()}</p>
        `,
        to: [{ email: process.env.CONTACT_EMAIL || 'contact@physiqfitness.com' }]
      });
      
      return res.status(200).json({ 
        success: true,
        message: "Test email sent successfully",
        data: response
      });
    } catch (error: any) {
      console.error("Brevo test error:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Error sending test email",
        error: error.message 
      });
    }
  });

  // Form submission endpoint
  app.post("/api/form", async (req, res) => {
    try {
      const { name, email, message } = req.body;
      
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
      
      return res.status(200).json({ 
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