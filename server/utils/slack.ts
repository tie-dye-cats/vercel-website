import { WebClient } from "@slack/web-api";

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
    await slackClient.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID || "general",
      text: `New Lead Submission:
• Name: ${data.firstName || 'Not provided'}
• Email: ${data.email}
• Phone: ${data.phone || 'Not provided'}
• Question: ${data.question || 'Not provided'}
• Marketing Consent: ${data.marketingConsent ? 'Yes' : 'No'}
• Communication Consent: ${data.communicationConsent ? 'Yes' : 'No'}`
    });
  } catch (error) {
    console.error("Error sending Slack notification:", error);
  }
}

export async function sendSlackNotification(data: {
  name: string;
  email: string;
  message: string;
}) {
  if (!slackClient) {
    console.log("Slack notifications disabled - no SLACK_BOT_TOKEN configured");
    return;
  }

  try {
    await slackClient.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID || "general",
      text: `New Form Submission:
• Name: ${data.name}
• Email: ${data.email}
• Message: ${data.message}`
    });
  } catch (error) {
    console.error("Error sending Slack notification:", error);
  }
}