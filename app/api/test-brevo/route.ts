import { NextResponse } from 'next/server';
import { brevoClient } from '@/lib/brevo';

export async function POST() {
  try {
    // Log the environment variable (without exposing the actual key)
    console.log('BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY);
    
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
        details: error instanceof Error ? error.message : 'Unknown error',
        envCheck: {
          hasApiKey: !!process.env.BREVO_API_KEY,
          apiKeyLength: process.env.BREVO_API_KEY?.length || 0
        }
      },
      { status: 500 }
    );
  }
} 