import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Client } from "@hubspot/api-client";
import { sendLeadNotification } from "./utils/slack";

export async function registerRoutes(app: Express): Promise<Server> {
  // Lead submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const { firstName, email, phone, question, marketingConsent, communicationConsent } = req.body;
      console.log("Received lead submission:", { firstName, email, phone, question, marketingConsent, communicationConsent });

      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email is required' 
        });
      }

      // Initialize HubSpot client for this request
      const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

      try {
        // Check if contact exists in HubSpot
        console.log("Checking if contact exists in HubSpot...");
        const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
          filterGroups: [{
            filters: [{
              propertyName: 'email',
              operator: 'EQ',
              value: email
            }]
          }]
        });

        let contactId;
        const properties = {
          email: email,
          firstname: firstName,
          phone: phone || "",
          message: question,
          hs_legal_basis: communicationConsent ? "Legitimate interest" : "Not applicable"
        };

        if (searchResponse.total > 0) {
          // Update existing contact
          console.log("Updating existing HubSpot contact...");
          const existingContact = searchResponse.results[0];
          contactId = existingContact.id;
          await hubspotClient.crm.contacts.basicApi.update(
            existingContact.id,
            { properties }
          );
        } else {
          // Create new contact
          console.log("Creating new HubSpot contact...");
          const newContact = await hubspotClient.crm.contacts.basicApi.create({
            properties
          });
          contactId = newContact.id;
        }

        // Add contact to lists using the proper API methods
        try {
          // Use contactLists API to add contact to the Main List
          await hubspotClient.crm.contacts.associationsApi.create(
            contactId,
            'contact_list',
            process.env.HUBSPOT_MAIN_LIST_ID,
            [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 1 }]
          );

          // Trigger email workflow for new leads if workflow ID is configured
          if (process.env.HUBSPOT_WORKFLOW_ID) {
            await hubspotClient.automation.enrollments.create({
              portalId: process.env.HUBSPOT_PORTAL_ID,
              workflowId: process.env.HUBSPOT_WORKFLOW_ID,
              contactIds: [contactId]
            });
          }

        } catch (error) {
          console.error('Error managing HubSpot lists:', error);
          // Continue execution even if list management fails
        }

        // Send Slack notification
        await sendLeadNotification({
          firstName,
          email,
          phone,
          question,
          marketingConsent,
          communicationConsent
        });

        return res.status(200).json({ 
          success: true,
          message: "Thank you! We'll get back to you within 1 hour.",
          data: { contactId } 
        });

      } catch (error: any) {
        console.error('Error with HubSpot operation:', error.message);
        console.error('Full error details:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Error submitting lead. Please try again.',
          error: error.message 
        });
      }
    } catch (error: any) {
      console.error("API Error:", error.message);
      console.error("Full error stack:", error);
      res.status(500).json({ 
        success: false, 
        message: "There was a problem submitting your information. Please try again.",
        error: error.message 
      });
    }
  });

  const server = createServer(app);
  return server;
}