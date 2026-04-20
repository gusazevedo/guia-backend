import { OAuth2Client } from 'google-auth-library';
import { env } from '../../config/env';
import { UnauthorizedError } from '../../lib/errors';

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

export type GoogleUser = {
  providerId: string;
  email: string;
  name: string;
  photoUrl?: string;
};

export async function verifyGoogleIdToken(idToken: string): Promise<GoogleUser> {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new UnauthorizedError('Google auth not configured');
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedError('Invalid Google token');
    }
    return {
      providerId: payload.sub,
      email: payload.email,
      name: payload.name ?? payload.email,
      photoUrl: payload.picture,
    };
  } catch {
    throw new UnauthorizedError('Invalid Google token');
  }
}
