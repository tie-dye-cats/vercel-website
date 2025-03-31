import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, message, phone, company } = data;

    // Clean the data
    const cleanedData = {
      name: String(name || '').trim(),
      email: String(email || '').trim(),
      message: String(message || '').trim(),
      phone: String(phone || '').trim(),
      company: String(company || '').trim(),
      timestamp: new Date().toISOString(),
    };

    // Validate required fields
    if (!cleanedData.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Replace with your integration platform's webhook URL
    const WEBHOOK_URL = process.env.WORKFLOW_WEBHOOK_URL;

    if (!WEBHOOK_URL) {
      throw new Error('Workflow webhook URL is not configured');
    }

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanedData)
    });

    if (!response.ok) {
      throw new Error('Failed to trigger integration workflow');
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