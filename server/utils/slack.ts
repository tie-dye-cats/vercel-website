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
    if (!process.env.SLACK_BOT_TOKEN) {
      console.error('SLACK_BOT_TOKEN is not configured');
      return;
    }

    if (!process.env.SLACK_CHANNEL_ID) {
      console.error('SLACK_CHANNEL_ID is not configured');
      return;
    }

    // Simple text-based message with markdown formatting
    const messageText = `🎯 *New Lead Submitted!*\n\n*Name:* ${leadData.firstName}\n*Email:* ${leadData.email}\n*Phone:* ${leadData.phone || 'Not provided'}\n*Marketing Consent:* ${leadData.marketingConsent ? '✅' : '❌'}\n${leadData.question ? `\n*Question:*\n>${leadData.question}` : ''}`;

    console.log('Attempting to send Slack notification to channel:', process.env.SLACK_CHANNEL_ID);

    const result = await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      text: messageText,
      mrkdwn: true
    });

    if (result.ok) {
      console.log('Slack notification sent successfully');
    } else {
      console.error('Failed to send Slack notification:', result.error);
    }
  } catch (error: any) {
    console.error('Error sending Slack notification:', {
      error: error.message,
      code: error.code,
      data: error.data
    });
    // Don't throw the error to prevent blocking the main flow
  }
}