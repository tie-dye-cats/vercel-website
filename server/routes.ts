import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Client } from "@hubspot/api-client";
import fetch from "node-fetch";

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

export async function registerRoutes(app: Express): Promise<Server> {
  // Lead submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const { firstName, email, phone, company, question, marketingConsent, communicationConsent, recaptchaToken } = req.body;
      console.log("Received lead submission:", { firstName, email, phone, company, question, marketingConsent, communicationConsent });

      // Create or update a contact in HubSpot
      const response = await hubspotClient.crm.contacts.basicApi.create({
        properties: {
          firstname: firstName,
          lastname: "", // Empty string since we're not collecting last name
          email: email,
          phone: phone,
          company: company || "",
          ad_question: question, // Store the question in a custom property
          marketing_consent: marketingConsent ? "Yes" : "No",
          communication_consent: communicationConsent ? "Yes" : "No",
        },
      });

      // Send notification to Slack
      if (process.env.SLACK_WEBHOOK_URL) {
        try {
          await fetch(process.env.SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              blocks: [
                {
                  type: "header",
                  text: {
                    type: "plain_text",
                    text: "🎯 New Lead Alert!",
                    emoji: true
                  }
                },
                {
                  type: "section",
                  fields: [
                    {
                      type: "mrkdwn",
                      text: `*Name:*\n${firstName}`
                    },
                    {
                      type: "mrkdwn",
                      text: `*Email:*\n${email}`
                    }
                  ]
                },
                {
                  type: "section",
                  fields: [
                    {
                      type: "mrkdwn",
                      text: `*Phone:*\n${phone || 'Not provided'}`
                    },
                    {
                      type: "mrkdwn",
                      text: `*Company:*\n${company || 'Not provided'}`
                    }
                  ]
                },
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: `*Question:*\n${question}`
                  }
                }
              ]
            })
          });
        } catch (slackError) {
          console.error("Error sending to Slack:", slackError);
          // Don't fail the whole request if Slack fails
        }
      }

      console.log("HubSpot API Response:", response);
      res.json({ success: true, contact: response });
    } catch (error: any) {
      console.error("API Error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to process lead",
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}