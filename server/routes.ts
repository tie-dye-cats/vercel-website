import type { Express } from "express";
import { sendEmailWithParams, createContactWithParams } from "./utils/brevo";
import { storage } from "./storage";
import { createTaskFromForm } from "./utils/clickup";
import { v4 as uuidv4 } from "uuid";
import { formatPhoneNumber } from "./utils/phone";

export function registerRoutes(app: Express) {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      services: {
        brevo: !!process.env.BREVO_API_KEY,
        clickup: !!process.env.CLICKUP_API_TOKEN
      }
    });
  });

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

  // Test endpoint for ClickUp integration
  app.post("/api/test-clickup", async (req, res) => {
    try {
      // Generate UUID for this submission
      const submissionId = uuidv4();
      console.log('Generated submission ID:', submissionId);

      console.log('ClickUp Test Request:', {
        body: req.body,
        env: {
          hasClickUpToken: !!process.env.CLICKUP_API_TOKEN,
          hasClickUpListId: !!process.env.CLICKUP_LIST_ID
        }
      });

      const task = await createTaskFromForm({
        firstName: req.body.firstName || "Test User",
        email: req.body.email || "test@example.com",
        phone: req.body.phone || "1234567890",
        question: req.body.question || "Testing ClickUp integration",
        marketingConsent: req.body.marketingConsent === true,
        communicationConsent: req.body.communicationConsent === true,
        company: req.body.company
      });

      return res.json({
        success: true,
        message: "Test ClickUp task created successfully",
        task
      });
    } catch (error: any) {
      console.error("ClickUp test error:", error);
      return res.status(500).json({
        success: false,
        message: "Error creating test task",
        error: error.message,
        type: error.type,
        details: error.details
      });
    }
  });

  // Lead form submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const { firstName, email, phone, question, marketingConsent, communicationConsent, company } = req.body;

      if (!firstName || !email || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          error: 'firstName, email, and phone are required'
        });
      }

      console.log('Processing lead submission:', {
        firstName,
        email,
        phone,
        company: company || 'Not provided'
      });

      // Format and validate phone number
      let formattedPhone;
      try {
        formattedPhone = formatPhoneNumber(phone);
        console.log('Formatted phone number:', formattedPhone);
        
        // Double-check that phone number is valid
        if (!formattedPhone || formattedPhone.length < 10) {
          throw new Error('Phone number appears to be truncated or invalid');
        }
      } catch (error: any) {
        console.error('Phone formatting error:', error);
        return res.status(400).json({
          success: false,
          message: 'Invalid phone number format',
          error: error.message || 'Invalid phone number format'
        });
      }

      // Generate a unique external ID for tracking
      const externalId = uuidv4();
      console.log('Generated external ID:', externalId);

      // Create contact in Brevo
      const contactData = {
        firstName,
        email,
        attributes: {
          LASTNAME: '',
          COMPANY: company || 'Not provided',
          QUESTION: question || '',
          SOURCE: 'Website Lead Form',
          SIGNUP_DATE: new Date().toISOString(),
          MARKETING_CONSENT: marketingConsent || false,
          COMMUNICATION_CONSENT: communicationConsent || false,
          EXT_ID: externalId,
          OPT_IN: (marketingConsent || false) ? 1 : 0,
          SMS: formattedPhone
        }
      };

      console.log('Sending contact data to Brevo:', contactData);
      
      try {
        await createContactWithParams(contactData);
        console.log('Successfully created/updated Brevo contact for:', email);
      } catch (brevoError: any) {
        console.error('Brevo API error:', {
          message: brevoError.message,
          stack: brevoError.stack,
          response: brevoError.response
        });
        
        // Return a user-friendly error based on the type of failure
        if (brevoError.message?.includes('phone')) {
          return res.status(400).json({
            success: false,
            message: 'Invalid phone number format',
            error: 'Please enter a valid phone number with area code'
          });
        }
        
        if (brevoError.message?.includes('email')) {
          return res.status(400).json({
            success: false,
            message: 'Invalid email address',
            error: 'Please enter a valid email address'
          });
        }
        
        // Continue with ClickUp task creation even if Brevo fails
        console.log('Continuing with ClickUp task creation despite Brevo failure');
      }

      // Create task in ClickUp
      console.log('Attempting to create ClickUp task for:', email);
      try {
        const task = await createTaskFromForm({
          firstName,
          email,
          phone,
          question,
          marketingConsent: marketingConsent || false,
          communicationConsent: communicationConsent || false,
          company: company || 'Not provided'
        });
        console.log('Successfully created ClickUp task for:', email);
        
        return res.json({
          success: true,
          message: 'Lead form submission successful',
          task
        });
      } catch (clickUpError: any) {
        console.error('ClickUp task creation error:', clickUpError);
        
        // Since we already attempted Brevo, return partial success
        return res.status(207).json({
          success: true,
          message: 'Lead information saved, but task creation failed',
          error: 'Your information was received, but there was an issue creating a follow-up task'
        });
      }

    } catch (error: any) {
      console.error('Lead form submission error:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      return res.status(500).json({
        success: false,
        message: 'Error submitting lead form',
        error: error.message || 'An unexpected error occurred'
      });
    }
  });
}