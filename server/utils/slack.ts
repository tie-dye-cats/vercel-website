import { WebClient } from "@slack/web-api";

// Utility function to clean the token
const cleanToken = (token: string) => {
  return token.trim();
};

// Initialize the Slack client without immediate validation
const rawToken = process.env.SLACK_BOT_TOKEN;
if (!rawToken) {
  console.error('Missing Slack Bot Token. Please set SLACK_BOT_TOKEN in your environment.');
}

const token = rawToken ? cleanToken(rawToken) : '';
const slackClient = new WebClient(token);

/**
 * Cleans the lead submission data.
 */
const cleanLeadData = (data: any) => {
  return {
    firstName: String(data.firstName || '').trim(),
    email: String(data.email || '').trim().toLowerCase(),
    phone: String(data.phone || '').replace(/\D/g, ''), // remove non-digit characters
    question: String(data.question || '').trim(),
    marketingConsent: Boolean(data.marketingConsent),
    communicationConsent: Boolean(data.communicationConsent)
  };
};

/**
 * Sends a message to Slack using chat.postMessage.
 */
export async function sendLeadNotification(leadData: {
  firstName: string;
  email: string;
  phone?: string;
  question?: string;
  marketingConsent?: boolean;
  communicationConsent?: boolean;
}) {
  try {
    // Validate token before sending
    if (!token) {
      console.error('Cannot send Slack notification: Missing SLACK_BOT_TOKEN');
      return;
    }

    if (!token.startsWith("xoxb-")) {
      console.error('Cannot send Slack notification: Invalid token type (should start with "xoxb-")');
      return;
    }

    console.log('Attempting to send Slack notification with data:', leadData);

    // Clean the data
    const cleanedData = cleanLeadData(leadData);

    // Format the message
    const message = `New lead from ${cleanedData.firstName}\nEmail: ${cleanedData.email}\nPhone: ${cleanedData.phone || 'Not provided'}\nQuestion: ${cleanedData.question || 'None'}\nMarketing Consent: ${cleanedData.marketingConsent ? 'Yes' : 'No'}`;

    console.log('Sending message to Slack:', {
      channel: '#ticketpeak',
      messageLength: message.length
    });

    // Send to Slack
    const response = await slackClient.chat.postMessage({
      channel: '#ticketpeak',
      text: message
    });

    console.log('Slack response:', {
      ok: response.ok,
      ts: response.ts,
      channel: response.channel
    });

  } catch (error: any) {
    console.error('Error sending Slack notification:', {
      error: error.message,
      code: error.code,
      data: error.data,
      stack: error.stack
    });
    // Don't throw the error - just log it and continue
  }
}