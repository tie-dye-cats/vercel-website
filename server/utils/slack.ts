import { WebClient } from "@slack/web-api";

console.log("Initializing Slack client...");
console.log("SLACK_BOT_TOKEN exists:", !!process.env.SLACK_BOT_TOKEN);
console.log("SLACK_CHANNEL_ID:", process.env.SLACK_CHANNEL_ID);

const slackClient = process.env.SLACK_BOT_TOKEN 
  ? new WebClient(process.env.SLACK_BOT_TOKEN)
  : null;

export async function sendLeadNotification(data: {
  firstName?: string;
  email: string;
  phone?: string;
  question?: string;
  marketingConsent?: boolean;
  communicationConsent?: boolean;
}) {
  if (!slackClient) {
    console.log("Slack notifications disabled - no SLACK_BOT_TOKEN configured");
    return;
  }

  try {
    console.log("Attempting to send Slack message to channel:", process.env.SLACK_CHANNEL_ID);
    const result = await slackClient.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID || "general",
      text: `New Lead Submission:
• Name: ${data.firstName || 'Not provided'}
• Email: ${data.email}
• Phone: ${data.phone || 'Not provided'}
• Question: ${data.question || 'Not provided'}
• Marketing Consent: ${data.marketingConsent ? 'Yes' : 'No'}
• Communication Consent: ${data.communicationConsent ? 'Yes' : 'No'}`
    });
    console.log("Slack message sent successfully:", result);
  } catch (error: any) {
    console.error("Slack notification failed - continuing without sending notification");
    console.error("Slack error details:", {
      message: error?.message || 'Unknown error',
      code: error?.code || 'Unknown code',
      data: error?.data || {},
      stack: error?.stack || 'No stack trace'
    });
  }
}