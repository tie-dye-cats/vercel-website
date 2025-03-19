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

    // Create a simple text message
    const messageText = `New Lead: ${leadData.firstName}\nEmail: ${leadData.email}${leadData.phone ? `\nPhone: ${leadData.phone}` : ''}${leadData.question ? `\nQuestion: ${leadData.question}` : ''}`;

    // Log the attempt
    console.log('Attempting to send Slack message to channel:', {
      channelId: process.env.SLACK_CHANNEL_ID,
      hasToken: !!process.env.SLACK_BOT_TOKEN
    });

    // Try to send the message
    const result = await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      text: messageText
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