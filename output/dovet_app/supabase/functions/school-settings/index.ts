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

    // GET: Fetch school settings
    if (req.method === 'GET') {
      let query = supabase
        .from('school_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (subdomain) {
        query = supabase
          .from('school_settings')
          .select('*')
          .eq('subdomain', subdomain)
          .order('created_at', { ascending: false })
          .limit(1)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching settings:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const settings = data?.[0] || { id: '', name: '', subdomain: '', logo_url: null, brand_color: '#2563eb' }
      
      return new Response(
        JSON.stringify(settings),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
