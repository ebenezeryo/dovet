import { createAdminClient } from '../_shared/supabase.ts';
import { verifyToken } from '../_shared/auth.ts';
import { corsHeaders, errorResponse, jsonResponse } from '../_shared/cors.ts';

const allowedRoles = new Set(['teacher', 'admin', 'exams_officer', 'principal']);

async function authenticate(req: Request) {
  const header = req.headers.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const claims = token ? await verifyToken(token) : null;
  return claims && allowedRoles.has(claims.role) ? claims : null;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const claims = await authenticate(req);
  if (!claims) return errorResponse('A valid staff session is required', 401);

  const supabase = createAdminClient();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('learn_packs')
      .select('*')
      .eq('school_id', claims.schoolId)
      .order('created_at', { ascending: false });
    if (error) return errorResponse(error.message, 500);
    return jsonResponse({ packs: data ?? [] });
  }

  if (req.method === 'POST') {
    const body = await req.json();
    const { title, subject, topic, yearGroup, curriculum, difficulty, durationDays, generationConfig } = body;
    if (![title, subject, topic, yearGroup].every((value) => typeof value === 'string' && value.trim())) {
      return errorResponse('Title, subject, topic, and year group are required', 400);
    }
    const { data, error } = await supabase
      .from('learn_packs')
      .insert({
        school_id: claims.schoolId,
        created_by: claims.userId,
        title: title.trim(), subject: subject.trim(), topic: topic.trim(), year_group: yearGroup.trim(),
        curriculum: typeof curriculum === 'string' ? curriculum.trim() : null,
        difficulty: typeof difficulty === 'string' && difficulty.trim() ? difficulty.trim() : 'Mixed',
        duration_days: Number.isInteger(durationDays) && durationDays > 0 ? durationDays : 5,
        generation_config: generationConfig && typeof generationConfig === 'object' ? generationConfig : {},
      })
      .select()
      .single();
    if (error) return errorResponse(error.message, 500);
    return jsonResponse({ pack: data }, 201);
  }

  if (req.method === 'PATCH') {
    const body = await req.json();
    if (typeof body.id !== 'string') return errorResponse('A pack id is required', 400);
    const changes: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.status !== undefined) {
      if (!['draft', 'published', 'archived'].includes(body.status)) return errorResponse('Invalid status', 400);
      changes.status = body.status;
    }
    const fields: Record<string, string> = { title: 'title', subject: 'subject', topic: 'topic', yearGroup: 'year_group', curriculum: 'curriculum', difficulty: 'difficulty' };
    for (const [input, column] of Object.entries(fields)) {
      if (body[input] !== undefined) {
        if (typeof body[input] !== 'string' || !body[input].trim()) return errorResponse(`${input} is required`, 400);
        changes[column] = body[input].trim();
      }
    }
    if (body.durationDays !== undefined) {
      if (!Number.isInteger(body.durationDays) || body.durationDays <= 0) return errorResponse('durationDays must be positive', 400);
      changes.duration_days = body.durationDays;
    }
    const { data, error } = await supabase
      .from('learn_packs')
      .update(changes)
      .eq('id', body.id)
      .eq('school_id', claims.schoolId)
      .select()
      .single();
    if (error) return errorResponse(error.message, 500);
    return jsonResponse({ pack: data });
  }

  if (req.method === 'DELETE') {
    const body = await req.json();
    if (typeof body.id !== 'string') return errorResponse('A pack id is required', 400);
    const { error } = await supabase.from('learn_packs').delete().eq('id', body.id).eq('school_id', claims.schoolId);
    if (error) return errorResponse(error.message, 500);
    return jsonResponse({ success: true });
  }

  return errorResponse('Method not allowed', 405);
});
