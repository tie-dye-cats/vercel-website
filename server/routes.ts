import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Client } from "@hubspot/api-client";

let hubspotClient: Client;
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
      const { firstName, email, phone, question, marketingConsent, communicationConsent } = req.body;
      console.log("Received lead submission:", { firstName, email, phone, question });

      if (!firstName || !email || !question) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields"
        });
      }

      const contactProperties = {
        firstname: firstName,
        lastname: "", // Empty string since we're not collecting last name
        email: email,
        phone: phone || "",
        ad_question: question,
        marketing_consent: marketingConsent ? "Yes" : "No",
        communication_consent: communicationConsent ? "Yes" : "No",
      };

      // Create new contact in HubSpot
      console.log("Creating HubSpot contact...");
      const hubspotResponse = await hubspotClient.crm.contacts.basicApi.create({
        properties: contactProperties
      });
      console.log("HubSpot contact created successfully:", hubspotResponse);

      res.json({ 
        success: true, 
        message: "Thank you! We'll get back to you within 1 hour.",
        contact: hubspotResponse 
      });
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