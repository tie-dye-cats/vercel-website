import { WebClient } from "@slack/web-api";

// Initialize the Slack client
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
    // Validate required environment variables
    if (!process.env.SLACK_BOT_TOKEN) {
      console.error('SLACK_BOT_TOKEN is not configured');
      return;
    }

    // Format message with markdown
    const message = {
      channel: '#ticketpeak',
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "🎯 *New Lead Notification*"
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
            },
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

    // Add question if provided
    if (leadData.question) {
      message.blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Question:*\n>${leadData.question}`
        }
      });
    }

    // Send message and handle response
    const result = await slack.chat.postMessage(message);

    if (result.ok) {
      console.log('Successfully sent Slack notification');
    } else {
      console.error('Failed to send Slack message:', result.error);
    }

  } catch (error: any) {
    // Log detailed error information
    console.error('Error sending Slack notification:', {
      message: error.message,
      code: error.code,
      data: error.data,
      stack: error.stack
    });
  }
}