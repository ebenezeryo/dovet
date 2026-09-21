import { createAdminClient } from '../_shared/supabase.ts';
import { signToken } from '../_shared/auth.ts';
import { corsHeaders, errorResponse } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Read subdomain from header (set by client-side middleware)
    const subdomain = req.headers.get('x-subdomain');
    if (!subdomain) {
      return errorResponse('Missing school subdomain', 400);
    }

    // Parse request body
    const { admissionNumber, surname } = await req.json();
    if (!admissionNumber || !surname) {
      return errorResponse('Admission number and surname are required', 400);
    }

    const supabase = createAdminClient();

    // 1. Look up the school by subdomain
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .select('id, name')
      .eq('subdomain', subdomain)
      .single();

    if (schoolError || !school) {
      return errorResponse('School not found', 404);
    }

    // 2. Look up the student with case-insensitive matching
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('id, admission_number, surname, first_name, school_id, grade, stream')
      .eq('school_id', school.id)
      .ilike('admission_number', admissionNumber)
      .ilike('surname', surname)
      .eq('is_active', true)
      .single();

    if (studentError || !student) {
      return errorResponse('Invalid admission number or surname', 401);
    }

    // 3. Sign JWT token
    const token = await signToken({
      userId: student.id,
      schoolId: student.school_id,
      role: 'student',
      subdomain,
      fullName: `${student.first_name || ''} ${student.surname}`.trim(),
    });

    // 4. Return token and set cookie
    const cookieHeader = `dovet_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800`;

    return new Response(
      JSON.stringify({
        success: true,
        token,
        user: {
          id: student.id,
          fullName: `${student.first_name || ''} ${student.surname}`.trim(),
          role: 'student',
          schoolName: school.name,
          grade: student.grade,
          stream: student.stream,
        },
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Set-Cookie': cookieHeader,
        },
      }
    );
  } catch (err) {
    console.error('auth-student error:', err);
    return errorResponse('Internal server error', 500);
  }
});
