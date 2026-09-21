import { createAdminClient } from '../_shared/supabase.ts';
import { verifyToken } from '../_shared/auth.ts';
import { corsHeaders, errorResponse } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Authenticate via JWT token
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
      .select('*, students(surname, first_name)')
      .eq('school_id', payload.schoolId)
      .order('created_at', { ascending: false });

    const yearGroup = url.searchParams.get('year');
    const subject = url.searchParams.get('subject');
    const className = url.searchParams.get('class');

    if (yearGroup) {
      query = query.ilike('class_name', `%${yearGroup}%`);
    }
    if (subject) {
      query = query.eq('subject', subject);
    }
    if (className) {
      query = query.eq('class_name', className);
    }

    const { data, error } = await query;

    if (error) {
      console.error('submissions-export query error:', error);
      return errorResponse('Failed to fetch submissions', 500);
    }

    // Get grade boundaries
    const { data: settings } = await supabase
      .from('school_settings')
      .select('grade_boundaries')
      .eq('school_id', payload.schoolId)
      .single();

    const boundaries = (settings?.grade_boundaries as Record<string, number>) || {
      A: 80, B: 65, C: 50, D: 35,
    };

    function getGrade(pct: number): string {
      if (pct >= (boundaries.A || 80)) return 'A';
      if (pct >= (boundaries.B || 65)) return 'B';
      if (pct >= (boundaries.C || 50)) return 'C';
      if (pct >= (boundaries.D || 35)) return 'D';
      return 'F';
    }

    function formatTime(seconds: number | null): string {
      if (!seconds) return '0:00';
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Build CSV
    const csvHeaders = [
      'Admission Number', 'Name', 'Surname', 'Class', 'Subject',
      'Score', 'Total', 'Percentage', 'Grade', 'Time Spent', 'Date',
    ];

    const csvRows = (data || []).map((sub: Record<string, unknown>) => {
      const pct = Number(sub.percentage) || 0;
      const student = sub.students as Record<string, string> | null;
      const firstName = student?.first_name || '';
      const surname = student?.surname || sub.student_name || '';

      return [
        sub.admission_no || '',
        firstName,
        surname,
        sub.class_name || '',
        sub.subject || '',
        String(sub.score || 0),
        String(sub.total || 0),
        pct.toFixed(1),
        getGrade(pct),
        formatTime(sub.time_spent as number | null),
        new Date(sub.created_at as string).toLocaleDateString(),
      ].map((field) => `"${String(field).replace(/"/g, '""')}"`).join(',');
    });

    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

    return new Response(csvContent, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="submissions_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (err) {
    console.error('submissions-export error:', err);
    return errorResponse('Internal server error', 500);
  }
});
