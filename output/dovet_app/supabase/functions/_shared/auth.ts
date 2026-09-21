import * as jose from 'https://esm.sh/jose@5.9.6';
import bcrypt from 'https://esm.sh/bcryptjs@2.4.3';

// JWT secret - in production, set via `supabase secrets set JWT_SECRET=your-secret`
const JWT_SECRET = Deno.env.get('JWT_SECRET') || 'dovet-dev-secret-change-in-production-32chars!';

const secret = new TextEncoder().encode(JWT_SECRET);

export interface TokenPayload {
  userId: string;
  schoolId: string;
  role: 'student' | 'teacher' | 'admin' | 'exams_officer' | 'principal';
  subdomain: string;
  fullName?: string;
}

/**
 * Sign a JWT token with the given payload. Expires in 8 hours.
 */
export async function signToken(payload: TokenPayload): Promise<string> {
  const token = await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret);
  return token;
}

/**
 * Verify a JWT token and return the payload, or null if invalid/expired.
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Hash a password using bcrypt with 10 salt rounds.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compare a plain text password against a bcrypt hash.
 */
export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
