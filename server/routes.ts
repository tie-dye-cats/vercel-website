import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Client } from "@hubspot/api-client";

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

export async function registerRoutes(app: Express): Promise<Server> {
  // Lead submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, company, marketingConsent, communicationConsent } = req.body;
      console.log("Received lead submission:", { firstName, lastName, email, phone, company, marketingConsent, communicationConsent });

      // Create or update a contact in HubSpot
      const response = await hubspotClient.crm.contacts.basicApi.create({
        properties: {
          firstname: firstName,
          lastname: lastName,
          email: email,
          phone: phone,
          company: company || "",
          marketing_consent: marketingConsent ? "Yes" : "No",
          communication_consent: communicationConsent ? "Yes" : "No",
        },
      });

      console.log("HubSpot API Response:", response);
      res.json({ success: true, contact: response });
    } catch (error: any) {
      console.error("Hubspot API Error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to create contact",
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}