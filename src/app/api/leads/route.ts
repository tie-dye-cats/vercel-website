import { NextResponse } from 'next/server';
import { createOrUpdateContact, sendTransactionalEmail, emailTemplates } from '../../../utils/brevoClient';
import { z } from 'zod';

// Input validation schema
const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().optional(),
  company: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = leadSchema.parse(body);

    // Create or update contact in Brevo
    await createOrUpdateContact({
      email: validatedData.email,
      firstName: validatedData.firstName,
      attributes: {
        PHONE: validatedData.phone || '',
        COMPANY: validatedData.company || '',
        MESSAGE: validatedData.message || '',
        SOURCE: 'Website Form'
      }
    });

    // Send confirmation email to user
    await sendTransactionalEmail({
      to: [{ email: validatedData.email, name: validatedData.firstName }],
      subject: 'Thank you for contacting AdVelocity',
      htmlContent: emailTemplates.contactFormTemplate(
        validatedData.firstName,
        validatedData.message || ''
      )
    });

    // Send notification email to admin
    await sendTransactionalEmail({
      to: [{ email: process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || '' }],
      subject: 'New Contact Form Submission',
      htmlContent: `
        <div style="font-family: Arial, sans-serif;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${validatedData.firstName}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
          ${validatedData.company ? `<p><strong>Company:</strong> ${validatedData.company}</p>` : ''}
          ${validatedData.message ? `<p><strong>Message:</strong></p><p>${validatedData.message}</p>` : ''}
        </div>
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully'
    });

  } catch (error: any) {
    console.error('Lead form submission error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid form data',
        errors: error.errors
      }, { status: 400 });
    }

    // Handle Brevo API errors
    if (error.response?.status === 429) {
      return NextResponse.json({
        success: false,
        message: 'Too many requests, please try again later'
      }, { status: 429 });
    }

    return NextResponse.json({
      success: false,
      message: 'An error occurred while processing your request'
    }, { status: 500 });
  }
} 