import { WebClient } from "@slack/web-api";

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

export async function sendLeadNotification(leadData: {
  firstName: string;
  email: string;
  phone?: string;
  question?: string;
  marketingConsent?: boolean;
  communicationConsent?: boolean;
}) {
  try {
    const message = {
      channel: process.env.SLACK_CHANNEL_ID!,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "🎯 New Lead Submitted!",
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Name:*\n${leadData.firstName}`
            },
            {
              type: "mrkdwn",
              text: `*Email:*\n${leadData.email}`
            }
          ]
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Phone:*\n${leadData.phone || 'Not provided'}`
            },
            {
              type: "mrkdwn",
              text: `*Marketing Consent:*\n${leadData.marketingConsent ? '✅' : '❌'}`
            }
          ]
        }
      ]
    };

    if (leadData.question) {
      message.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Question:*\n${leadData.question}`
        }
      });
    }

    await slack.chat.postMessage(message);
    console.log('Slack notification sent successfully');
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    // Don't throw the error to prevent blocking the main flow
  }
}