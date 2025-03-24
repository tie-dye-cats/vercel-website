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