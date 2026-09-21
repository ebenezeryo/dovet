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

    // GET: Fetch branding settings
    if (req.method === 'GET') {
      let query = supabase
        .from('school_branding')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (subdomain) {
        query = supabase
          .from('school_branding')
          .select('*')
          .eq('subdomain', subdomain)
          .order('created_at', { ascending: false })
          .limit(1)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching branding:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const branding = data?.[0] || { name: '', brand_color: '#2563eb', logo_url: null }
      
      return new Response(
        JSON.stringify(branding),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // PUT: Update branding settings
    if (req.method === 'PUT') {
      const body = await req.json()
      const { name, brand_color, logo_url } = body

      // Check if a record exists for this subdomain
      const { data: existing } = await supabase
        .from('school_branding')
        .select('id')
        .eq('subdomain', subdomain)
        .limit(1)

      if (existing && existing.length > 0) {
        // Update existing record
        const { data, error } = await supabase
          .from('school_branding')
          .update({
            name: name || '',
            brand_color: brand_color || '#2563eb',
            logo_url: logo_url || null,
            updated_at: new Date().toISOString()
          })
          .eq('subdomain', subdomain)
          .select()
          .single()

        if (error) {
          console.error('Error updating branding:', error)
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify(data),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('school_branding')
          .insert({
            subdomain: subdomain,
            name: name || '',
            brand_color: brand_color || '#2563eb',
            logo_url: logo_url || null
          })
          .select()
          .single()

        if (error) {
          console.error('Error creating branding:', error)
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify(data),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
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
