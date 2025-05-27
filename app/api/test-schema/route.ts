import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Create Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Test 1: Try with just email
    const test1 = await supabase
      .from('leads')
      .insert({ email: 'test1@example.com' })
      .select()
      .single()

    if (test1.error) {
      return NextResponse.json({
        test: 'email_only',
        error: test1.error.message,
        code: test1.error.code
      })
    }

    // Clean up test1
    if (test1.data?.id) {
      await supabase.from('leads').delete().eq('id', test1.data.id)
    }

    // Test 2: Try with email and name
    const test2 = await supabase
      .from('leads')
      .insert({ 
        email: 'test2@example.com',
        name: 'Test User'
      })
      .select()
      .single()

    if (test2.error) {
      return NextResponse.json({
        test: 'email_and_name',
        error: test2.error.message,
        code: test2.error.code,
        previousTest: 'email_only worked'
      })
    }

    // Clean up test2
    if (test2.data?.id) {
      await supabase.from('leads').delete().eq('id', test2.data.id)
    }

    return NextResponse.json({
      success: true,
      message: 'All basic columns exist',
      emailOnlyWorked: true,
      emailAndNameWorked: true,
      sampleData: test2.data
    })

  } catch (error) {
    console.error('Schema test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 