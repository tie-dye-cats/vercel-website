import { createClient } from '@supabase/supabase-js';
import { ContactsApi } from '@getbrevo/brevo';
import axios from 'axios';
import { z } from 'zod';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Initialize Brevo client
const brevoApiKey = process.env.BREVO_API_KEY;
const brevoListId = process.env.BREVO_LIST_ID;
const brevoClient = brevoApiKey ? new ContactsApi({
  basePath: 'https://api.brevo.com/v3',
  apiKey: brevoApiKey
}) : null;

// Initialize ClickUp client
const clickupApiToken = process.env.CLICKUP_API_TOKEN;
const clickupListId = process.env.CLICKUP_LIST_ID;
const clickupClient = clickupApiToken && clickupListId ? axios.create({
  baseURL: 'https://api.clickup.com/api/v2',
  headers: {
    'Authorization': clickupApiToken,
    'Content-Type': 'application/json'
  }
}) : null;

// Validation schema
const submissionSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email address').trim(),
  question: z.string().min(5, 'Question must be at least 5 characters').trim(),
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree to receive communications'
  })
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

    // Validate data against schema
    const validationResult = submissionSchema.safeParse(data);
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
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

    // Insert into Supabase
    if (!supabase) {
      console.warn('Supabase is not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error',
          details: 'Database is not properly configured'
        },
        { status: 500 }
      );
    }

    const { data: supabaseData, error: supabaseError } = await supabase
      .from('contact_submissions')
      .insert([
        {
          first_name: validatedData.firstName,
          email: validatedData.email,
          question: validatedData.question,
          consent: validatedData.consent,
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
          details: 'Failed to save submission'
        },
        { status: 500 }
      );
    }

    // Execute Brevo and ClickUp integrations in parallel
    const [brevoResult, clickupResult] = await Promise.allSettled([
      // Brevo integration
      brevoClient ? (async () => {
        try {
          const contactData = {
            email: validatedData.email,
            attributes: {
              FIRSTNAME: validatedData.firstName
            },
            updateEnabled: true
          };

          if (brevoListId && !isNaN(brevoListId)) {
            contactData.listIds = [parseInt(brevoListId)];
          }

          return await brevoClient.createContact(contactData);
        } catch (error) {
          console.error('Brevo API error:', error);
          throw error;
        }
      })() : Promise.resolve(null),

      // ClickUp integration
      clickupClient ? (async () => {
        try {
          const taskName = `Contact: ${validatedData.firstName} (${validatedData.email}) - ${new Date().toISOString().split('T')[0]}`;
          const taskDescription = `
Contact Information:
Name: ${validatedData.firstName}
Email: ${validatedData.email}
Consent: ${validatedData.consent ? 'Yes' : 'No'}

Question:
${validatedData.question}
          `.trim();

          return await clickupClient.post(`/list/${clickupListId}/task`, {
            name: taskName,
            description: taskDescription
          });
        } catch (error) {
          console.error('ClickUp API error:', error);
          throw error;
        }
      })() : Promise.resolve(null)
    ]);

    // Log integration results
    if (brevoResult.status === 'rejected') {
      console.error('Brevo integration failed:', brevoResult.reason);
    }
    if (clickupResult.status === 'rejected') {
      console.error('ClickUp integration failed:', clickupResult.reason);
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      supabaseId: supabaseData.id
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