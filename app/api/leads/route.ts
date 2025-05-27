import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { BrevoService } from '../../../lib/brevo.service'
import { ClickUpService } from '../../../lib/clickup.service'

// Validation schema matching actual database schema
const leadSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  email: z.string().email('Invalid email address'),
  question: z.string().min(1, 'Question is required'),
  name: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
})

// Function to send lead to Brevo using the service class
async function sendToBrevo(leadData: any) {
  try {
    const apiKey = process.env.BREVO_API_KEY
    if (!apiKey) {
      console.warn('Brevo API key not configured, skipping Brevo integration')
      return { success: false, error: 'API key not configured' }
    }

    const listId = parseInt(process.env.BREVO_LIST_ID || '1')
    const brevoService = new BrevoService(apiKey, listId)

    // Create contact in Brevo
    const result = await brevoService.createContact({
      email: leadData.email,
      firstName: leadData.first_name,
      lastName: leadData.name || '',
      SMS: leadData.phone || '',
      attributes: {
        QUESTION: leadData.question,
        SOURCE: leadData.source || 'website',
        LEAD_DATE: new Date().toISOString()
      },
      listIds: [listId]
    })

    console.log('Brevo contact result:', result)
    return result
  } catch (error: any) {
    console.error('Brevo integration error:', error)
    // Don't fail the entire request if Brevo fails
    return { success: false, error: error.message }
  }
}

// Function to create task in ClickUp using the service class
async function createClickUpTask(leadData: any, leadId: number) {
  try {
    const apiKey = process.env.CLICKUP_API_KEY
    const listId = process.env.CLICKUP_LIST_ID
    
    if (!apiKey || !listId) {
      console.warn('ClickUp API key or List ID not configured, skipping ClickUp integration')
      return { success: false, error: 'ClickUp not configured' }
    }

    const clickUpService = new ClickUpService({
      apiKey,
      listId
    })

    // Create task in ClickUp
    const result = await clickUpService.createLeadTask({
      leadId,
      firstName: leadData.first_name,
      email: leadData.email,
      phone: leadData.phone,
      question: leadData.question,
      source: leadData.source || 'website',
      leadDate: new Date().toISOString()
    })

    console.log('ClickUp task result:', result)
    return result
  } catch (error: any) {
    console.error('ClickUp integration error:', error)
    // Don't fail the entire request if ClickUp fails
    return { success: false, error: error.message }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request data
    const validatedData = leadSchema.parse(body)
    
    // Debug environment variables
    console.log('Environment Debug:')
    console.log('- SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    console.log('- SUPABASE_SERVICE_ROLE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0)
    console.log('- NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    // Create Supabase client with service role key (bypasses RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Service role key not configured' },
        { status: 500 }
      )
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Insert lead into database with all fields
    const insertData: any = {
      first_name: validatedData.first_name,
      email: validatedData.email,
      question: validatedData.question,
      source: validatedData.source || 'website',
    }
    
    // Add optional fields if provided
    if (validatedData.name) {
      insertData.name = validatedData.name
    }
    
    if (validatedData.phone) {
      insertData.phone = validatedData.phone
    }
    
    if (validatedData.message) {
      insertData.message = validatedData.message
    }

    const { data, error } = await supabase
      .from('leads')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { 
          error: 'Failed to save lead',
          details: error.message,
          code: error.code
        },
        { status: 500 }
      )
    }

    // Send to Brevo (don't fail if this fails)
    const brevoResult = await sendToBrevo(validatedData)
    
    // Create ClickUp task (don't fail if this fails)
    const clickUpResult = await createClickUpTask(validatedData, data.id)
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Lead saved successfully',
        leadId: data.id,
        brevo: brevoResult,
        clickup: clickUpResult
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Lead submission error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client with anon key for read operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Test database connection
    const { data, error } = await supabase
      .from('leads')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'ok',
      message: 'Leads API is working',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Leads API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 