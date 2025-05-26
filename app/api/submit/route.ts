import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Validate request body
    let data;
    try {
      data = await request.json();
    } catch (error) {
      console.error('Invalid JSON in request body:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid request format',
          details: 'Request body must be valid JSON'
        },
        { status: 400 }
      );
    }

    const { firstName, email, phone, consent, phoneConsent } = data;

    // Validate required fields
    if (!firstName?.trim()) {
      return NextResponse.json(
        { 
          success: false,
          error: 'First name is required',
          details: 'Please provide your first name'
        },
        { status: 400 }
      );
    }

    if (!email?.trim()) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email is required',
          details: 'Please provide your email address'
        },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Consent is required',
          details: 'Please agree to receive communications'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid email format',
          details: 'Please provide a valid email address'
        },
        { status: 400 }
      );
    }

    // Clean the data
    const cleanedData = {
      properties: {
        firstname: String(firstName).trim(),
        email: String(email).trim(),
        phone: phone ? String(phone).trim() : undefined,
        consent: consent ? "Yes" : "No",
        phone_consent: phoneConsent ? "Yes" : "No",
        source: "Website Contact Form",
        timestamp: new Date().toISOString(),
      }
    };

    // Check for Brevo API key
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.error('Brevo API key is not configured');
      return NextResponse.json(
        { 
          success: false,
          error: 'Server configuration error',
          details: 'Contact form is not properly configured'
        },
        { status: 500 }
      );
    }

    // Submit to Brevo
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify(cleanedData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Brevo API error:', result);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to create contact',
          details: result.message || 'Error creating contact in Brevo'
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Form submitted successfully'
    });
  } catch (error) {
    console.error('Unexpected error in form submission:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
} 