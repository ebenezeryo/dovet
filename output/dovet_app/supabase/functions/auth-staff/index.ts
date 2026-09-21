import { createAdminClient } from '../_shared/supabase.ts';
import { signToken, comparePassword } from '../_shared/auth.ts';
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
    // Read subdomain from header
    const subdomain = req.headers.get('x-subdomain');
    if (!subdomain) {
      return errorResponse('Missing school subdomain', 400);
    }

    // Parse request body
    const { email, password } = await req.json();
    if (!email || !password) {
      return errorResponse('Email and password are required', 400);
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

    // 2. Look up the user by email and school
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, password_hash, full_name, role, school_id')
      .eq('school_id', school.id)
      .ilike('email', email)
      .eq('is_active', true)
      .single();

    if (userError || !user) {
      return errorResponse('Invalid email or password', 401);
    }

    // 3. Compare password with bcrypt
    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
      return errorResponse('Invalid email or password', 401);
    }

    // 4. Update last login timestamp (fire and forget)
    supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id)
      .then();

    // 5. Sign JWT token
    const token = await signToken({
      userId: user.id,
      schoolId: user.school_id,
      role: user.role as 'teacher' | 'admin' | 'exams_officer' | 'principal',
      subdomain,
      fullName: user.full_name,
    });

    // 6. Return token and set cookie
    const cookieHeader = `dovet_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800`;

    return new Response(
      JSON.stringify({
        success: true,
        token,
        subdomain,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          role: user.role,
          schoolName: school.name,
          subdomain,
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
    console.error('auth-staff error:', err);
    return errorResponse('Internal server error', 500);
  }
});
