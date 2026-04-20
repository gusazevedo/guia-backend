import { createRemoteJWKSet, jwtVerify } from 'jose';
import { env } from '../../config/env';
import { UnauthorizedError } from '../../lib/errors';

const APPLE_JWKS = createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'));
const APPLE_ISSUER = 'https://appleid.apple.com';

export type AppleUser = {
  providerId: string;
  email: string;
  name: string;
};

export async function verifyAppleIdToken(
  idToken: string,
  fallbackName?: string,
): Promise<AppleUser> {
  if (!env.APPLE_CLIENT_ID) {
    throw new UnauthorizedError('Apple auth not configured');
  }
  try {
    const { payload } = await jwtVerify(idToken, APPLE_JWKS, {
      issuer: APPLE_ISSUER,
      audience: env.APPLE_CLIENT_ID,
    });
    const sub = payload.sub;
    const email = typeof payload.email === 'string' ? payload.email : undefined;
    if (!sub || !email) {
      throw new UnauthorizedError('Invalid Apple token');
    }
    return {
      providerId: sub,
      email,
      name: fallbackName ?? email,
    };
  } catch {
    throw new UnauthorizedError('Invalid Apple token');
  }
}
