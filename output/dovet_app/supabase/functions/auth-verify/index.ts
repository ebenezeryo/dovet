import { verifyToken } from '../_shared/auth.ts';
import { corsHeaders, errorResponse, jsonResponse } from '../_shared/cors.ts';

/**
 * Auth verification endpoint.
 * Validates the dovet_token cookie or Authorization header.
 * Used by the frontend middleware guard to check if a user is authenticated.
 */
Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  try {
    // Try to get token from cookie first, then Authorization header
    let token: string | null = null;

    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      const dovetCookie = cookies.find(c => c.startsWith('dovet_token='));
      if (dovetCookie) {
        token = dovetCookie.split('=')[1];
      }
    }

    if (!token) {
      const authHeader = req.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }

    if (!token) {
      return errorResponse('No authentication token provided', 401);
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return errorResponse('Invalid or expired token', 401);
    }

    return jsonResponse({
      valid: true,
      user: {
        userId: payload.userId,
        schoolId: payload.schoolId,
        role: payload.role,
        subdomain: payload.subdomain,
        fullName: payload.fullName,
      },
    });
  } catch (err) {
    console.error('auth-verify error:', err);
    return errorResponse('Internal server error', 500);
  }
});
