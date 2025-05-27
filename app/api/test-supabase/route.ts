import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        error: 'Missing Supabase environment variables',
        hint: 'Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env'
      }, { status: 500 })
    }

    // Test Supabase connection
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Simple connection test
    const { data, error } = await supabase
      .from('leads')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({
        error: 'Supabase connection failed',
        details: error.message,
        hint: error.hint || 'Check if the leads table exists in your Supabase database'
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Supabase connection working',
      timestamp: new Date().toISOString(),
      config: {
        url: supabaseUrl.substring(0, 30) + '...',
        keyLength: supabaseAnonKey.length
      },
      data: data
    })

  } catch (error) {
    console.error('Supabase test error:', error)
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 