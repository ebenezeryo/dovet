import { createAdminClient } from '../_shared/supabase.ts';
import { verifyToken } from '../_shared/auth.ts';
import { corsHeaders, errorResponse, jsonResponse } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Authenticate via JWT token (cookie or Authorization header)
    const authHeader = req.headers.get('Authorization');
    const cookieHeader = req.headers.get('Cookie');
    let token: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else if (cookieHeader) {
      const match = cookieHeader.match(/dovet_token=([^;]+)/);
      if (match) token = match[1];
    }

    if (!token) {
      return errorResponse('Unauthorized', 401);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return errorResponse('Invalid or expired token', 401);
    }

    const supabase = createAdminClient();
    const url = new URL(req.url);

    // Build query with filters
    let query = supabase
      .from('submissions')
      .select('*')
      .eq('school_id', payload.schoolId)
      .order('created_at', { ascending: false });

    // Apply filters
    const yearGroup = url.searchParams.get('year');
    const subject = url.searchParams.get('subject');
    const className = url.searchParams.get('class');
    const fromDate = url.searchParams.get('from');
    const toDate = url.searchParams.get('to');

    if (yearGroup) {
      query = query.ilike('class_name', `%${yearGroup}%`);
    }
    if (subject) {
      query = query.eq('subject', subject);
    }
    if (className) {
      query = query.eq('class_name', className);
    }
    if (fromDate) {
      query = query.gte('created_at', fromDate);
    }
    if (toDate) {
      query = query.lte('created_at', toDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('submissions query error:', error);
      return errorResponse('Failed to fetch submissions', 500);
    }

    // Get grade boundaries for computing grades
    const { data: settings } = await supabase
      .from('school_settings')
      .select('grade_boundaries')
      .eq('school_id', payload.schoolId)
      .single();

    const boundaries = (settings?.grade_boundaries as Record<string, number>) || {
      A: 80, B: 65, C: 50, D: 35,
    };

    // Compute grades for each submission
    const submissions = (data || []).map((sub: Record<string, unknown>) => {
      const pct = Number(sub.percentage) || 0;
      let grade = 'F';
      if (pct >= (boundaries.A || 80)) grade = 'A';
      else if (pct >= (boundaries.B || 65)) grade = 'B';
      else if (pct >= (boundaries.C || 50)) grade = 'C';
      else if (pct >= (boundaries.D || 35)) grade = 'D';

      return { ...sub, grade };
    });

    // Compute summary stats
    const totalSubmissions = submissions.length;
    const scores = submissions.map((s: Record<string, unknown>) => Number(s.percentage) || 0);
    const avgScore = totalSubmissions > 0
      ? scores.reduce((a: number, b: number) => a + b, 0) / totalSubmissions
      : 0;
    const highestScore = totalSubmissions > 0 ? Math.max(...scores) : 0;
    const lowestScore = totalSubmissions > 0 ? Math.min(...scores) : 0;

    return jsonResponse({
      submissions,
      summary: {
        totalSubmissions,
        averageScore: Math.round(avgScore * 100) / 100,
        highestScore,
        lowestScore,
      },
    });
  } catch (err) {
    console.error('submissions error:', err);
    return errorResponse('Internal server error', 500);
  }
});
