import 'dotenv/config';
import { createClerkClient, type M2MToken } from '@clerk/backend';

function decodeJwtPayload(token: string): Record<string, unknown> {
  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error('Expected a JWT with three parts.');
  }

  return JSON.parse(Buffer.from(parts[1]!, 'base64url').toString('utf8')) as Record<string, unknown>;
}

async function main(): Promise<void> {
  const machineSecretKey = process.env.CLERK_MACHINE_SECRET_KEY;
  const secretKey = process.env.CLERK_CLIENT_SECRET_KEY;

  if (!machineSecretKey) {
    throw new Error('Missing CLERK_MACHINE_SECRET_KEY.');
  }

  if (!secretKey) {
    throw new Error('Missing CLERK_CLIENT_SECRET_KEY.');
  }

  const clerkProducer = createClerkClient({ machineSecretKey });
  const token: M2MToken = await clerkProducer.m2m.createToken({
    tokenFormat: 'jwt',
    claims: {
      permissions: ['read:users', 'write:users']
    }
  });

  const clerkVerifier = createClerkClient({ secretKey });
  const verifiedToken = await clerkVerifier.m2m.verify({ token: token.token! });

  console.assert(verifiedToken.claims === null, 'Expected verifiedToken.claims to be null');

  console.log('\nVerified M2MToken');
  console.log(
    JSON.stringify(
      {
        id: verifiedToken.id,
        subject: verifiedToken.subject,
        scopes: verifiedToken.scopes,
        claims: verifiedToken.claims,
        expired: verifiedToken.expired,
        expiration: verifiedToken.expiration
      },
      null,
      2
    )
  );

  console.log('\nComparison');
  console.log(
    JSON.stringify(
      decodeJwtPayload(token.token!),
      null,
      2
    )
  );
}

main().catch((error: unknown) => {
  console.error('\nReproduction failed');
  console.error(error);
  process.exit(1);
});