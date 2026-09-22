import { verifyToken } from '../_shared/auth.ts';
import { corsHeaders, errorResponse, jsonResponse } from '../_shared/cors.ts';

const staffRoles = new Set(['teacher', 'admin', 'exams_officer', 'principal']);

function extractOutputText(response: Record<string, unknown>) {
  if (typeof response.output_text === 'string') return response.output_text;
  const output = Array.isArray(response.output) ? response.output : [];
  for (const item of output) {
    if (!item || typeof item !== 'object') continue;
    const content = Array.isArray((item as Record<string, unknown>).content) ? (item as Record<string, unknown>).content as unknown[] : [];
    for (const part of content) {
      if (part && typeof part === 'object' && typeof (part as Record<string, unknown>).text === 'string') return (part as Record<string, unknown>).text as string;
    }
  }
  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return errorResponse('Method not allowed', 405);

  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const claims = token ? await verifyToken(token) : null;
  if (!claims || !staffRoles.has(claims.role)) return errorResponse('A valid staff session is required', 401);

  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) return errorResponse('AI generation is not configured. Add OPENAI_API_KEY to Supabase Edge Function secrets.', 503);

  const body = await req.json().catch(() => null);
  const { subject, topic, yearGroup, curriculum, difficulty, questionCount = 20, notes = '' } = body || {};
  if (![subject, topic, yearGroup, curriculum].every((value) => typeof value === 'string' && value.trim())) {
    return errorResponse('Subject, topic, year group, and curriculum are required', 400);
  }
  const total = Math.max(4, Math.min(Number(questionCount) || 20, 30));
  const schema = {
    type: 'object', additionalProperties: false, required: ['questions'], properties: {
      questions: {
        type: 'array', minItems: total, maxItems: total,
        items: { type: 'object', additionalProperties: false, required: ['text', 'hint', 'opts', 'correct', 'why', 'steps'], properties: {
          text: { type: 'string' }, hint: { type: 'string' },
          opts: { type: 'array', minItems: 4, maxItems: 4, items: { type: 'string' } },
          correct: { type: 'integer', minimum: 0, maximum: 3 }, why: { type: 'string' },
          steps: { type: 'array', minItems: 1, maxItems: 3, items: { type: 'string' } },
        } },
      },
    },
  };
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: Deno.env.get('OPENAI_LEARN_PACK_MODEL') || 'gpt-4o-mini', store: false, max_output_tokens: 8000,
      instructions: 'You create accurate, age-appropriate formative multiple-choice questions. Use only the requested subject and topic. Never substitute content from a different subject. Return exactly the JSON schema.',
      input: `Create ${total} distinct questions for ${subject}, topic: ${topic}. Learners: ${yearGroup}. Curriculum: ${curriculum}. Difficulty: ${difficulty}. Teacher notes: ${notes || 'None'}. Include one worked-example style first question and clear explanations.`,
      text: { format: { type: 'json_schema', name: 'learn_pack_questions', strict: true, schema } },
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) return errorResponse(typeof result?.error?.message === 'string' ? result.error.message : 'The AI provider could not generate this pack', 502);
  const text = extractOutputText(result);
  if (!text) return errorResponse('The AI provider returned no usable content', 502);
  try {
    return jsonResponse(JSON.parse(text));
  } catch {
    return errorResponse('The AI provider returned invalid structured content', 502);
  }
});
