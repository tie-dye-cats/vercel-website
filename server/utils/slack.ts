import { WebClient } from '@slack/web-api';

const slackClient = process.env.SLACK_BOT_TOKEN ? new WebClient(process.env.SLACK_BOT_TOKEN) : null;

export async function sendSlackNotification(data: {
  name?: string;
  email?: string;
  message?: string;
  channel?: string;
}) {
  if (!slackClient) {
    console.log('Slack notifications disabled - no SLACK_BOT_TOKEN configured');
    return;
  }

  try {
    const channel = data.channel || '#ticketpeak';
    const message = `New Form Submission:
Name: ${data.name || 'N/A'}
Email: ${data.email || 'N/A'}
Message: ${data.message || 'N/A'}`;

    console.log('Sending message to Slack:', {
      channel,
      messageLength: message.length
    });

    const response = await slackClient.chat.postMessage({
      channel,
      text: message
    });

    console.log('Slack response:', {
      ok: response.ok,
      ts: response.ts,
      channel: response.channel
    });

    return response;

  } catch (error: any) {
    console.error('Error sending Slack notification:', {
      error: error.message,
      code: error.code,
      data: error.data,
      stack: error.stack
    });
    throw error;
  }
}
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
