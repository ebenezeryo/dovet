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
      title,
      subject,
      totalMarks,
      durationMinutes,
      instructions,
      yearGroup,
      className,
      examType,
      isPublished
    } = body

    // Validation
    if (!title || !subject || !totalMarks) {
      return new Response(
        JSON.stringify({ error: 'Title, subject, and total marks are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: exam, error } = await supabase
      .from('exams')
      .insert({
        school_subdomain: subdomain,
        title: title,
        subject: subject,
        total_marks: parseInt(totalMarks) || 100,
        duration_minutes: parseInt(durationMinutes) || 60,
        instructions: instructions || '',
        year_group: yearGroup || '',
        class_name: className || '',
        exam_type: examType || 'formative',
        is_published: isPublished || false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating exam:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ exam, message: 'Exam created successfully' }),
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
