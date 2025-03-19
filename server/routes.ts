import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Client } from "@hubspot/api-client";

// Initialize HubSpot client
let hubspotClient: any;
try {
  if (!process.env.HUBSPOT_ACCESS_TOKEN) {
    throw new Error("HUBSPOT_ACCESS_TOKEN is not configured");
  }
  hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });
  console.log("HubSpot client initialized successfully");
} catch (error) {
  console.error("Failed to initialize HubSpot client:", error);
  throw error;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Lead submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const { firstName, email, phone, question } = req.body;
      console.log("Received lead submission:", { firstName, email, phone, question });

      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email is required' 
        });
      }

      try {
        // First try to find if contact exists
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

        let response;
        const properties = {
          firstname: firstName,
          email: email,
          phone: phone || "",
          message: question
        };

        if (searchResponse.total > 0) {
          // Update existing contact
          console.log("Updating existing HubSpot contact...");
          const existingContact = searchResponse.results[0];
          response = await hubspotClient.crm.contacts.basicApi.update(
            existingContact.id,
            { properties }
          );
        } else {
          // Create new contact
          console.log("Creating new HubSpot contact...");
          response = await hubspotClient.crm.contacts.basicApi.create({
            properties
          });
        }

        console.log("HubSpot operation successful:", response);

        return res.status(200).json({ 
          success: true,
          message: "Thank you! We'll get back to you within 1 hour.",
          data: response 
        });

      } catch (error: any) {
        console.error('Error with HubSpot operation:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Error submitting lead',
          error: error.message
        });
      }
    } catch (error: any) {
      console.error("API Error:", error);
      res.status(500).json({ 
        success: false, 
        message: "There was a problem submitting your information. Please try again.",
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}