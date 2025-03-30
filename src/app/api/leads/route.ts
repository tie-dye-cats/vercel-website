import { NextResponse } from 'next/server';
import { sendLeadNotification } from '../../../../server/utils/slack';
import { sendEmailWithParams, createContactWithParams } from '../../../../server/utils/brevo';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, company, question, marketingConsent, communicationConsent } = body;

    if (!firstName || !email || !phone) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields: firstName, email, and phone are required"
      }, { status: 400 });
    }
    
    // Create or update contact in Brevo
    await createContactWithParams({
      email,
      firstName,
      attributes: {
        LASTNAME: lastName || '',
        COMPANY: company || '',
        PHONE: phone,
        QUESTION: question || '',
        SOURCE: 'Website Lead Form',
        SIGNUP_DATE: new Date().toISOString(),
        MARKETING_CONSENT: marketingConsent || false,
        COMMUNICATION_CONSENT: communicationConsent || false
      }
    });

    // Send notification to Slack
    await sendLeadNotification({
      firstName,
      email,
      phone,
      question: question || `Company: ${company || 'Not provided'}`,
      marketingConsent: marketingConsent || false,
      communicationConsent: communicationConsent || false
    });

    // Send confirmation email only if they consented to communication
    if (communicationConsent) {
      await sendEmailWithParams({
        subject: 'Thank you for your interest in AdVelocity',
        htmlContent: `
          <h2>Thank you for reaching out!</h2>
          <p>Hi ${firstName},</p>
          <p>We have received your information and one of our experts will be in touch with you shortly.</p>
          ${question ? `<p>Your message:</p><blockquote>${question}</blockquote>` : ''}
          <p>Best regards,<br>The AdVelocity Team</p>
        `,
        to: [{ email, name: firstName }]
      });
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Lead form submission successful"
    });
  } catch (error: any) {
    console.error("Lead form submission error:", error);
    return NextResponse.json({ 
      success: false,
      message: "Error submitting lead form",
      error: error.message 
    }, { status: 500 });
  }
} 