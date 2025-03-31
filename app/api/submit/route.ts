import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { firstName, email, phone, consent, phoneConsent } = data;

    // Clean the data
    const cleanedData = {
      properties: {
        firstname: String(firstName || '').trim(),
        email: String(email || '').trim(),
        phone: phone ? String(phone).trim() : undefined,
        consent: consent ? "Yes" : "No",
        phone_consent: phoneConsent ? "Yes" : "No",
        source: "Website Contact Form",
        timestamp: new Date().toISOString(),
      }
    };

    // Validate required fields
    if (!cleanedData.properties.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Submit to Brevo
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '',
      },
      body: JSON.stringify(cleanedData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create contact in Brevo');
    }

    return NextResponse.json({ 
      success: true,
      message: 'Form submitted successfully'
    });
  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to submit form',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 