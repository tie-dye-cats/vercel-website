import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Client } from "@hubspot/api-client";

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

export async function registerRoutes(app: Express): Promise<Server> {
  // Lead submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const { name, email, company } = req.body;

      // Create or update a contact in HubSpot
      const response = await hubspotClient.crm.contacts.basicApi.create({
        properties: {
          firstname: name.split(" ")[0],
          lastname: name.split(" ").slice(1).join(" ") || "",
          email: email,
          company: company || "",
        },
      });

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