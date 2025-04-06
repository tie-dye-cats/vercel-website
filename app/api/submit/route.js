import { createClient } from '@supabase/supabase-js';
import { ContactsApi } from '@getbrevo/brevo';
import axios from 'axios';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createTaskFromForm } from '../../../server/utils/clickup';
import { v4 as uuidv4 } from 'uuid';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Log environment variable status
console.log('Environment Variables Status:', {
  hasSupabaseUrl: !!supabaseUrl,
  hasSupabaseKey: !!supabaseKey,
  hasBrevoKey: !!process.env.BREVO_API_KEY,
  hasBrevoListId: !!process.env.BREVO_LIST_ID,
  hasClickUpToken: !!process.env.CLICKUP_API_TOKEN,
  hasClickUpListId: !!process.env.CLICKUP_LIST_ID
});

let supabase = null;
try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully');
  } else {
    console.error('Missing Supabase credentials:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
}

// Initialize Brevo client
let brevoClient = null;
try {
  const brevoApiKey = process.env.BREVO_API_KEY;
  if (brevoApiKey) {
    brevoClient = new ContactsApi({
      basePath: 'https://api.brevo.com/v3',
      apiKey: brevoApiKey
    });
    console.log('Brevo client initialized successfully');
  } else {
    console.warn('Brevo API key not provided');
  }
} catch (error) {
  console.error('Error initializing Brevo client:', error);
}

// Initialize ClickUp client
let clickupClient = null;
try {
  const clickupApiToken = process.env.CLICKUP_API_TOKEN;
  const clickupListId = process.env.CLICKUP_LIST_ID;
  if (clickupApiToken && clickupListId) {
    clickupClient = axios.create({
      baseURL: 'https://api.clickup.com/api/v2',
      headers: {
        'Authorization': clickupApiToken,
        'Content-Type': 'application/json'
      }
    });
    console.log('ClickUp client initialized successfully');
  } else {
    console.warn('ClickUp credentials not complete:', { 
      hasToken: !!clickupApiToken, 
      hasListId: !!clickupListId 
    });
  }
} catch (error) {
  console.error('Error initializing ClickUp client:', error);
}

// Validation schema
const submissionSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email address').trim(),
  phone: z.string().min(10, 'Phone number must be at least 10 characters').trim(),
  question: z.string().min(5, 'Question must be at least 5 characters').trim(),
  marketingConsent: z.boolean().optional(),
  communicationConsent: z.boolean().optional()
});

// CORS handler
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request) {
  console.log('Received form submission request');
  try {
    // Generate UUID for this submission
    const submissionId = uuidv4();
    console.log('Generated submission ID:', submissionId);

    // Validate request body
    let data;
    try {
      data = await request.json();
      console.log('Received data:', JSON.stringify(data));
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

    // Validate data against schema
    const validationResult = submissionSchema.safeParse(data);
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      console.error('Validation failed:', errors);
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: errors
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;
    console.log('Validation successful:', validatedData);

    // Check Supabase configuration
    if (!supabase) {
      console.error('Supabase client not initialized');
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error',
          details: 'Database is not properly configured',
          env: {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseKey
          }
        },
        { status: 500 }
      );
    }

    // Insert into Supabase
    console.log('Attempting Supabase insert...');
    const { data: supabaseData, error: supabaseError } = await supabase
      .from('contact_submissions')
      .insert([
        {
          id: submissionId,
          first_name: validatedData.firstName,
          email: validatedData.email,
          phone: validatedData.phone,
          question: validatedData.question,
          marketing_consent: validatedData.marketingConsent,
          communication_consent: validatedData.communicationConsent,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (supabaseError) {
      console.error('Supabase insert error:', supabaseError);
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          details: supabaseError.message,
          code: supabaseError.code
        },
        { status: 500 }
      );
    }

    console.log('Supabase insert successful:', supabaseData);

    // Execute integrations in parallel
    const integrationPromises = [];
    const integrationResults = {
      brevo: null,
      clickup: null
    };

    // Add Brevo integration if configured
    if (brevoClient) {
      console.log('Attempting Brevo integration...');
      integrationPromises.push(
        (async () => {
          try {
            const contactData = {
              email: validatedData.email,
              attributes: {
                FIRSTNAME: validatedData.firstName
              },
              updateEnabled: true
            };

            const brevoListId = process.env.BREVO_LIST_ID;
            if (brevoListId && !isNaN(brevoListId)) {
              contactData.listIds = [parseInt(brevoListId)];
            }

            const result = await brevoClient.createContact(contactData);
            console.log('Brevo integration successful');
            integrationResults.brevo = { success: true };
            return result;
          } catch (error) {
            console.error('Brevo API error:', error);
            integrationResults.brevo = { 
              success: false, 
              error: error.message 
            };
            return null;
          }
        })()
      );
    }

    // Add ClickUp integration if configured
    if (process.env.CLICKUP_API_TOKEN && process.env.CLICKUP_LIST_ID) {
      console.log('Attempting ClickUp integration...');
      integrationPromises.push(
        (async () => {
          try {
            const result = await createTaskFromForm({
              submissionId,
              firstName: validatedData.firstName,
              email: validatedData.email,
              phone: validatedData.phone,
              question: validatedData.question,
              marketingConsent: validatedData.marketingConsent,
              communicationConsent: validatedData.communicationConsent
            });
            console.log('ClickUp integration successful');
            integrationResults.clickup = { success: true, taskId: result.id };
            return result;
          } catch (error) {
            console.error('ClickUp API error:', error);
            integrationResults.clickup = { 
              success: false, 
              error: error.message 
            };
            return null;
          }
        })()
      );
    }

    // Execute all integrations in parallel
    if (integrationPromises.length > 0) {
      console.log('Executing integrations...');
      const results = await Promise.allSettled(integrationPromises);
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Integration ${index} failed:`, result.reason);
        }
      });
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      submissionId,
      supabaseId: supabaseData.id,
      integrations: integrationResults
    });

  } catch (error) {
    console.error('Unexpected error in form submission:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unexpected error occurred',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 