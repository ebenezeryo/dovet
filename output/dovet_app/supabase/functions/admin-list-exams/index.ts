import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-subdomain',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const subdomain = req.headers.get('x-subdomain') || ''

    if (!subdomain) {
      return new Response(
        JSON.stringify({ error: 'School subdomain is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Try school_id-based schema first (from migration 20250128150000)
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .select('id')
      .eq('subdomain', subdomain)
      .maybeSingle()

    if (schoolError) {
      console.error('Error fetching school:', schoolError)
    }

    let exams: any[] = []

    if (school?.id) {
      // Try school_id-based exams table
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('school_id', school.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        exams = data
      } else {
        // Fallback: try school_subdomain-based exams (from migration 20250101000000)
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('exams')
          .select('*')
          .eq('school_subdomain', subdomain)
          .order('created_at', { ascending: false })

        if (!fallbackError && fallbackData) {
          exams = fallbackData
        } else {
          console.log('No exams found, errors:', { primary: error, fallback: fallbackError })
          exams = []
        }
      }
    } else {
      // No school found - try school_subdomain directly
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('exams')
        .select('*')
        .eq('school_subdomain', subdomain)
        .order('created_at', { ascending: false })

      if (!fallbackError && fallbackData) {
        exams = fallbackData
      } else {
        exams = []
      }
    }

    return new Response(
      JSON.stringify({ exams, count: exams.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
