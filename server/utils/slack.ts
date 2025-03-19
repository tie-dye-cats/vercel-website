import { WebClient } from "@slack/web-api";

// Utility function to clean the token
const cleanToken = (token: string) => {
  return token.trim();
};

// Initialize the Slack client with more detailed error handling
const rawToken = process.env.SLACK_BOT_TOKEN;
if (!rawToken) {
  console.error('Missing Slack Bot Token. Please set SLACK_BOT_TOKEN in your environment.');
  process.exit(1);
}

// Clean and validate token
const token = cleanToken(rawToken);
if (!token.startsWith("xoxb-")) {
  console.error("Invalid token type. Please ensure you're using a valid bot token (should start with 'xoxb-').");
  process.exit(1);
}

const slackClient = new WebClient(token);

// Verify token on initialization
(async () => {
  try {
    const authTest = await slackClient.auth.test();
    console.log('Slack authentication successful:', {
      user_id: authTest.user_id,
      team_id: authTest.team_id,
      bot_id: authTest.bot_id
    });
  } catch (error: any) {
    console.error('Slack authentication failed:', {
      error: error.message,
      code: error.code,
      data: error.data
    });
    process.exit(1);
  }
})();

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
    throw error;  // Re-throw to be handled by the API route
  }
}