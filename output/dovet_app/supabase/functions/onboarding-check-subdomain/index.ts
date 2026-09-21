import { createAnonClient } from '../_shared/supabase.ts';
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
    const url = new URL(req.url);
    const subdomain = url.searchParams.get('subdomain');

    if (!subdomain) {
      return errorResponse('Missing subdomain parameter', 400);
    }

    // Validate subdomain format (alphanumeric and hyphens only, 3-30 chars)
    const subdomainRegex = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;
    if (!subdomainRegex.test(subdomain)) {
      return jsonResponse({
        available: false,
        reason: 'Subdomain must be 3-30 characters, lowercase letters, numbers, and hyphens only.',
      });
    }

    // Reserved subdomains
    const reserved = ['www', 'api', 'admin', 'app', 'mail', 'ftp', 'dashboard', 'login'];
    if (reserved.includes(subdomain)) {
      return jsonResponse({
        available: false,
        reason: 'This subdomain is reserved. Please choose another.',
      });
    }

    const supabase = createAnonClient();

    const { data, error } = await supabase
      .from('schools')
      .select('id')
      .eq('subdomain', subdomain)
      .maybeSingle();

    if (error) {
      console.error('check-subdomain error:', error);
      return errorResponse('Database error', 500);
    }

    return jsonResponse({ available: !data });
  } catch (err) {
    console.error('onboarding-check-subdomain error:', err);
    return errorResponse('Internal server error', 500);
  }
});
