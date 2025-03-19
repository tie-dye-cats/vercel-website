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
        // Create contact in HubSpot
        const response = await hubspotClient.crm.contacts.basicApi.create({
          properties: {
            email: email,
            firstname: firstName,
            phone: phone || "",
            ad_question: question
          }
        });

        console.log("HubSpot contact created:", response);

        return res.status(200).json({ 
          success: true,
          message: "Thank you! We'll get back to you within 1 hour.",
          data: response 
        });

      } catch (error) {
        console.error('Error creating HubSpot contact:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Error submitting lead' 
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