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
      const { firstName, email, phone, company, question, marketingConsent, communicationConsent } = req.body;
      console.log("Received lead submission:", { 
        firstName, 
        email, 
        phone, 
        company, 
        question, 
        marketingConsent, 
        communicationConsent
      });

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

      let hubspotResponse;
      const contactProperties = {
        firstname: firstName,
        lastname: "", // Empty string since we're not collecting last name
        email: email,
        phone: phone,
        company: company || "",
        ad_question: question,
        marketing_consent: marketingConsent ? "Yes" : "No",
        communication_consent: communicationConsent ? "Yes" : "No",
      };

      if (searchResponse.total > 0) {
        // Update existing contact
        console.log("Updating existing HubSpot contact...");
        const existingContact = searchResponse.results[0];
        hubspotResponse = await hubspotClient.crm.contacts.basicApi.update(
          existingContact.id,
          { properties: contactProperties }
        );
      } else {
        // Create new contact
        console.log("Creating new HubSpot contact...");
        hubspotResponse = await hubspotClient.crm.contacts.basicApi.create({
          properties: contactProperties
        });
      }
      console.log("HubSpot contact operation successful:", hubspotResponse);

      // Send notification to Slack
      if (process.env.SLACK_WEBHOOK_URL) {
        console.log("Attempting to send Slack notification...");
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
          console.log("Slack notification sent successfully");
        } catch (slackError) {
          console.error("Error sending to Slack:", slackError);
          // Don't fail the whole request if Slack fails
        }
      } else {
        console.log("Slack webhook URL not configured, skipping notification");
      }

      res.json({ success: true, contact: hubspotResponse });
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