import { AuthProvider } from '@prisma/client';
import { prisma } from '../../db/prisma';
import { signJwt } from '../../lib/jwt';
import { verifyGoogleIdToken } from './google.verifier';
import { verifyAppleIdToken } from './apple.verifier';

async function upsertAndSign(params: {
  provider: AuthProvider;
  providerId: string;
  email: string;
  name: string;
  photoUrl?: string;
}) {
  const user = await prisma.user.upsert({
    where: { provider_providerId: { provider: params.provider, providerId: params.providerId } },
    update: { email: params.email, name: params.name, photoUrl: params.photoUrl },
    create: params,
  });
  return { token: signJwt({ sub: user.id }), user };
}

export async function authWithGoogle(idToken: string) {
  const g = await verifyGoogleIdToken(idToken);
  return upsertAndSign({ provider: 'GOOGLE', ...g });
}

export async function authWithApple(idToken: string, name?: string) {
  const a = await verifyAppleIdToken(idToken, name);
  return upsertAndSign({ provider: 'APPLE', ...a });
}
