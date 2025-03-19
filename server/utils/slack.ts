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
    if (!process.env.SLACK_CHANNEL_ID) {
      throw new Error("SLACK_CHANNEL_ID environment variable must be set");
    }

    // Simple text-based message first
    const messageText = `🎯 *New Lead Submitted!*\n\n*Name:* ${leadData.firstName}\n*Email:* ${leadData.email}\n*Phone:* ${leadData.phone || 'Not provided'}\n*Marketing Consent:* ${leadData.marketingConsent ? '✅' : '❌'}\n${leadData.question ? `\n*Question:*\n>${leadData.question}` : ''}`;

    await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      text: messageText,
      mrkdwn: true
    });

    console.log('Slack notification sent successfully');
  } catch (error) {
    console.error('Error sending Slack notification:', error);
    // Don't throw the error to prevent blocking the main flow
  }
}