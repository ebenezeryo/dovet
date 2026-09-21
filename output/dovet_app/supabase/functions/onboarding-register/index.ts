import { createAdminClient } from '../_shared/supabase.ts';
import { hashPassword, signToken } from '../_shared/auth.ts';
import { corsHeaders, errorResponse, jsonResponse } from '../_shared/cors.ts';

interface RegisterPayload {
  schoolName: string;
  country: string;
  schoolLevel: 'primary' | 'secondary' | 'both';
  subdomain: string;
  brandColor: string;
  logoUrl?: string;
  yearGroupLabels: string[];
  subjects: { name: string; yearGroup?: string }[];
  adminFullName: string;
  adminEmail: string;
  adminPassword: string;
  termsAccepted: boolean;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    const body = await req.json() as RegisterPayload;

    // ── Validation ──
    if (!body.schoolName?.trim()) {
      return errorResponse('School name is required', 400);
    }
    if (!body.subdomain?.trim()) {
      return errorResponse('Subdomain is required', 400);
    }
    if (!body.adminFullName?.trim()) {
      return errorResponse('Admin full name is required', 400);
    }
    if (!body.adminEmail?.trim()) {
      return errorResponse('Admin email is required', 400);
    }
    if (!body.adminPassword || body.adminPassword.length < 8) {
      return errorResponse('Password must be at least 8 characters', 400);
    }
    if (!body.termsAccepted) {
      return errorResponse('You must accept the terms and conditions', 400);
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;
    if (!subdomainRegex.test(body.subdomain)) {
      return errorResponse('Invalid subdomain format', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.adminEmail)) {
      return errorResponse('Invalid email format', 400);
    }

    const supabase = createAdminClient();

    // ── Check subdomain availability ──
    const { data: existingSchool } = await supabase
      .from('schools')
      .select('id')
      .eq('subdomain', body.subdomain)
      .maybeSingle();

    if (existingSchool) {
      return errorResponse('Subdomain is already taken', 409);
    }

    // ── Check email uniqueness ──
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .ilike('email', body.adminEmail)
      .maybeSingle();

    if (existingUser) {
      return errorResponse('An account with this email already exists', 409);
    }

    // ── 1. Insert school ──
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .insert({
        name: body.schoolName.trim(),
        subdomain: body.subdomain.toLowerCase().trim(),
        country: body.country?.trim() || null,
        school_level: body.schoolLevel || 'both',
        brand_color: body.brandColor || '#2563eb',
        logo_url: body.logoUrl || null,
      })
      .select('id')
      .single();

    if (schoolError || !school) {
      console.error('School insert error:', schoolError);
      return errorResponse('Failed to create school record', 500);
    }

    // ── 2. Insert school_settings ──
    const { error: settingsError } = await supabase
      .from('school_settings')
      .insert({
        school_id: school.id,
        year_group_labels: body.yearGroupLabels || [],
        grade_boundaries: { A: 80, B: 65, C: 50, D: 35 },
        result_visibility: true,
        academic_term: null,
      });

    if (settingsError) {
      console.error('Settings insert error:', settingsError);
      // Non-fatal: school was created, settings can be added later
    }

    // ── 3. Insert subjects ──
    if (body.subjects && body.subjects.length > 0) {
      const subjectRows = body.subjects.map((s) => ({
        school_id: school.id,
        name: s.name.trim(),
        year_group: s.yearGroup || null,
      }));

      const { error: subjectsError } = await supabase
        .from('subjects')
        .insert(subjectRows);

      if (subjectsError) {
        console.error('Subjects insert error:', subjectsError);
        // Non-fatal: subjects can be added later
      }
    }

    // ── 4. Create admin user ──
    const passwordHash = await hashPassword(body.adminPassword);

    let insertedUserId: string | null = null;

    const { data: insertedUser, error: userError } = await supabase
      .from('users')
      .insert({
        school_id: school.id,
        email: body.adminEmail.trim().toLowerCase(),
        password_hash: passwordHash,
        full_name: body.adminFullName.trim(),
        role: 'admin',
      })
      .select('id')
      .single();

    if (insertedUser) {
      insertedUserId = insertedUser.id;
    }

    if (userError) {
      console.error('User insert error:', userError);
      return errorResponse('Failed to create admin account', 500);
    }

    // ── 5. Auto-sign JWT so the admin is logged in immediately ──
    const subdomain = body.subdomain.toLowerCase().trim();
    const token = await signToken({
      userId: insertedUserId || '',
      schoolId: school.id,
      role: 'admin',
      subdomain,
      fullName: body.adminFullName.trim(),
    });

    const userData = {
      id: insertedUserId || '',
      fullName: body.adminFullName.trim(),
      email: body.adminEmail.trim().toLowerCase(),
      role: 'admin',
      schoolName: body.schoolName.trim(),
      subdomain,
    };

    // ── Success ──
    return jsonResponse({
      success: true,
      subdomain,
      token,
      user: userData,
    });
  } catch (err) {
    console.error('onboarding-register error:', err);
    return errorResponse('Internal server error', 500);
  }
});
