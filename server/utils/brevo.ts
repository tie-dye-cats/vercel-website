import * as SibApiV3Sdk from '@sendinblue/client';

// Initialize Brevo API client
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Set the API key
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

export async function sendEmail(params: {
  subject: string;
  htmlContent: string;
  to: { email: string; name?: string }[];
  from?: { email: string; name: string };
}) {
  if (!process.env.BREVO_API_KEY) {
    console.log("Brevo notifications disabled - no BREVO_API_KEY configured");
    return;
  }

  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = params.subject;
    sendSmtpEmail.htmlContent = params.htmlContent;
    sendSmtpEmail.to = params.to;
    sendSmtpEmail.sender = params.from || { 
      name: 'Physiq Fitness Website', 
      email: 'noreply@physiqfitness.com' 
    };

    console.log('Sending email with params:', {
      subject: params.subject,
      to: params.to,
      from: sendSmtpEmail.sender
    });

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
} 