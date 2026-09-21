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

    // Try to fetch from the users table (school_id-based schema)
    // First, get the school_id from the subdomain
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .select('id')
      .eq('subdomain', subdomain)
      .maybeSingle()

    if (schoolError) {
      console.error('Error fetching school:', schoolError)
    }

    let staff: any[] = []

    if (school?.id) {
      // Try school_id-based users table first
      const { data, error } = await supabase
        .from('users')
        .select('id, school_id, email, full_name, role, is_active, last_login_at, created_at, updated_at')
        .eq('school_id', school.id)
        .order('created_at', { ascending: false })

      if (!error && data) {
        staff = data
      } else {
        // Fallback: try school_subdomain-based schema (from earlier migration)
        // The users table might not have school_subdomain, so we return empty
        console.log('No staff found with school_id, error:', error)
        staff = []
      }
    } else {
      // No school found by subdomain - return empty
      staff = []
    }

    return new Response(
      JSON.stringify({ staff, count: staff.length }),
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
