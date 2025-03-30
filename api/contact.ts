import { VercelRequest, VercelResponse } from '@vercel/node';
import { WebClient } from "@slack/web-api";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo/dist/api/apis';
import { SendSmtpEmail } from '@getbrevo/brevo/dist/model/models';

const slackClient = process.env.SLACK_BOT_TOKEN 
  ? new WebClient(process.env.SLACK_BOT_TOKEN)
  : null;

const brevoApi = new TransactionalEmailsApi();
brevoApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Send to Slack
    if (slackClient) {
      await slackClient.chat.postMessage({
        channel: process.env.SLACK_CHANNEL_ID || "general",
        text: `New Contact Form Submission:
• Name: ${name || 'Not provided'}
• Email: ${email}
• Message: ${message || 'Not provided'}`
      });
    }

    // Send confirmation email
    const emailData = new SendSmtpEmail();
    emailData.subject = 'Thank you for contacting Physiq Fitness';
    emailData.htmlContent = `
      <h2>Thank you for reaching out!</h2>
      <p>Hi ${name},</p>
      <p>We have received your message and will get back to you shortly.</p>
      <p>Your message:</p>
      <blockquote>${message}</blockquote>
      <p>Best regards,<br>The Physiq Fitness Team</p>
    `;
    emailData.sender = { name: 'Physiq Fitness Website', email: 'noreply@physiqfitness.com' };
    emailData.to = [{ email, name }];

    await brevoApi.sendTransacEmail(emailData);

    return res.status(200).json({
      success: true,
      message: "Form submission successful"
    });
  } catch (error: any) {
    console.error("Form submission error:", error);
    return res.status(500).json({
      success: false,
      message: "Error submitting form",
      error: error.message
    });
  }
} 