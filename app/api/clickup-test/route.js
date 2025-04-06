import { NextResponse } from 'next/server';
import { createTaskFromForm } from '../../../server/utils/clickup';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Log the incoming request
    console.log('ClickUp Test Request:', {
      body,
      env: {
        hasClickUpToken: !!process.env.CLICKUP_API_TOKEN,
        hasClickUpListId: !!process.env.CLICKUP_LIST_ID
      }
    });

    // Create task in ClickUp
    const task = await createTaskFromForm({
      firstName: body.firstName,
      email: body.email,
      phone: body.phone,
      question: body.question,
      marketingConsent: body.marketingConsent,
      communicationConsent: body.communicationConsent
    });

    return NextResponse.json({
      success: true,
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('ClickUp Test Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        type: error.type,
        details: error.details
      },
      { status: 500 }
    );
  }
} 