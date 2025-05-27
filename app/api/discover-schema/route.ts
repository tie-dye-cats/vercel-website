import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Try different combinations to discover required fields
    const tests = [
      { name: 'email_only', data: { email: 'test1@example.com' } },
      { name: 'email_first_name', data: { email: 'test2@example.com', first_name: 'Test' } },
      { name: 'email_first_name_question', data: { email: 'test3@example.com', first_name: 'Test', question: 'Test question' } },
      { name: 'all_basic_fields', data: { 
        email: 'test4@example.com', 
        first_name: 'Test', 
        question: 'Test question',
        phone: '555-1234'
      }},
    ]

    const results = []

    for (const test of tests) {
      const { data, error } = await supabase
        .from('leads')
        .insert(test.data)
        .select()
        .single()

      if (error) {
        results.push({
          test: test.name,
          success: false,
          error: error.message,
          code: error.code
        })
        // Stop at first error to see what's missing
        break
      } else {
        // Clean up successful test
        if (data?.id) {
          await supabase.from('leads').delete().eq('id', data.id)
        }
        results.push({
          test: test.name,
          success: true,
          data: data
        })
      }
    }

    return NextResponse.json({
      message: 'Schema discovery complete',
      results: results
    })

  } catch (error) {
    console.error('Schema discovery error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 