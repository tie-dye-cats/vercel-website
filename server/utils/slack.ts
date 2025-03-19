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

    console.log('Attempting to send Slack notification with:', {
      channel: process.env.SLACK_CHANNEL_ID,
      botToken: process.env.SLACK_BOT_TOKEN ? 'Present' : 'Missing'
    });

    // Start with a simple message to test connectivity
    const result = await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      text: `New lead: ${leadData.firstName} (${leadData.email})`,
    });

    if (result.ok) {
      console.log('Basic Slack notification sent successfully');

      // If basic message works, send the detailed message
      const detailedResult = await slack.chat.postMessage({
        channel: process.env.SLACK_CHANNEL_ID,
        text: `🎯 *New Lead Submitted!*\n\n*Name:* ${leadData.firstName}\n*Email:* ${leadData.email}\n*Phone:* ${leadData.phone || 'Not provided'}\n*Marketing Consent:* ${leadData.marketingConsent ? '✅' : '❌'}\n${leadData.question ? `\n*Question:*\n>${leadData.question}` : ''}`,
        mrkdwn: true
      });

      if (detailedResult.ok) {
        console.log('Detailed Slack notification sent successfully');
      } else {
        console.error('Failed to send detailed notification:', detailedResult.error);
      }
    } else {
      console.error('Failed to send basic notification:', result.error);
    }
  } catch (error: any) {
    console.error('Error sending Slack notification:', {
      message: error.message,
      code: error.code,
      data: error.data
    });
  }
}