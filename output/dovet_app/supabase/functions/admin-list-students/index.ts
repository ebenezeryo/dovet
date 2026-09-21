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

    // Try school_id-based schema first
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .select('id')
      .eq('subdomain', subdomain)
      .maybeSingle()

    if (schoolError) {
      console.error('Error fetching school:', schoolError)
    }

    let students: any[] = []

    if (school?.id) {
      // Try school_id-based students table
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('school_id', school.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        students = data
      } else {
        // Fallback: try school_subdomain-based students
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('students')
          .select('*')
          .eq('school_subdomain', subdomain)
          .order('created_at', { ascending: false })

        if (!fallbackError && fallbackData) {
          students = fallbackData
        } else {
          console.log('No students found, errors:', { primary: error, fallback: fallbackError })
          students = []
        }
      }
    } else {
      // No school found - try school_subdomain directly
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('students')
        .select('*')
        .eq('school_subdomain', subdomain)
        .order('created_at', { ascending: false })

      if (!fallbackData) {
        students = fallbackData || []
      } else {
        students = fallbackData
      }
    }

    return new Response(
      JSON.stringify({ students, count: students.length }),
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
