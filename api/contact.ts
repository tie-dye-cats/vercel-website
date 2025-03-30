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
  console.log('Received request:', {
    method: req.method,
    headers: req.headers,
    body: req.body
  });

  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  try {
    const { name, email, message } = req.body;
    console.log('Parsed request body:', { name, email, message });

    if (!name || !email || !message) {
      console.log('Missing required fields:', { name, email, message });
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, and message are required'
      });
    }

    // Send to Slack
    if (slackClient) {
      console.log('Sending Slack notification...');
      try {
        await slackClient.chat.postMessage({
          channel: process.env.SLACK_CHANNEL_ID || "general",
          text: `New Contact Form Submission:
• Name: ${name || 'Not provided'}
• Email: ${email}
• Message: ${message || 'Not provided'}`
        });
        console.log('Slack notification sent successfully');
      } catch (slackError: any) {
        console.error('Error sending Slack notification:', slackError);
        // Continue with the form submission even if Slack fails
      }
    }

    // Send confirmation email
    console.log('Sending confirmation email...');
    try {
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
      console.log('Confirmation email sent successfully');
    } catch (emailError: any) {
      console.error('Error sending confirmation email:', emailError);
      // Continue with the form submission even if email fails
    }

    const response = {
      success: true,
      message: "Form submission successful"
    };
    console.log('Sending success response:', response);
    return res.status(200).json(response);
  } catch (error: any) {
    console.error("Form submission error:", {
      message: error.message,
      stack: error.stack,
      details: error.response?.body || error
    });
    
    const errorResponse = {
      success: false,
      error: error.message || "Error submitting form",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
    console.log('Sending error response:', errorResponse);
    return res.status(500).json(errorResponse);
  }
} 