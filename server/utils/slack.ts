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

    if (!process.env.SLACK_CHANNEL_ID) {
      console.error('SLACK_CHANNEL_ID is not configured');
      return;
    }

    // Log the attempt
    console.log('Attempting to send Slack message to channel:', {
      channelId: process.env.SLACK_CHANNEL_ID,
      tokenType: process.env.SLACK_BOT_TOKEN.startsWith('xoxb-') ? 'Bot Token' : 'Other'
    });

    // Try to send the message
    const result = await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      text: `New Lead Notification 🎯\n*Name:* ${leadData.firstName}\n*Email:* ${leadData.email}\n*Phone:* ${leadData.phone || 'Not provided'}\n*Marketing Consent:* ${leadData.marketingConsent ? '✅' : '❌'}${leadData.question ? `\n*Question:*\n>${leadData.question}` : ''}`,
      parse: 'full'
    });

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
      data: error.data
    });
  }
}