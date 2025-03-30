import { NextResponse } from 'next/server';
import { brevoClient } from '@/lib/brevo';

export async function POST() {
  try {
    // Test the Brevo API connection by getting the account information
    const account = await brevoClient.getAccount();
    
    return NextResponse.json({
      success: true,
      message: 'Brevo API connection successful',
      account: account
    });
  } catch (error) {
    console.error('Brevo API test failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to connect to Brevo API',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 