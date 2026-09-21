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
    const body = await req.json()

    const {
      firstName,
      middleName,
      lastName,
      fullName,
      admissionNumber,
      grade,
      className,
      sex,
      parentsContact,
      address,
      country,
      state,
      lga
    } = body

    // Validation
    if (!firstName || !lastName || !admissionNumber || !grade || !sex) {
      return new Response(
        JSON.stringify({ error: 'First name, last name, admission number, grade, and sex are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const computedFullName = fullName || `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`.trim()

    const { data: student, error } = await supabase
      .from('students')
      .insert({
        school_subdomain: subdomain,
        first_name: firstName,
        middle_name: middleName || '',
        last_name: lastName,
        full_name: computedFullName,
        admission_number: admissionNumber,
        grade: grade,
        class_name: className || '',
        sex: sex,
        parents_contact: parentsContact || '',
        address: address || '',
        country: country || 'Nigeria',
        state: state || '',
        lga: lga || ''
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating student:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ student, message: 'Student enrolled successfully' }),
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
