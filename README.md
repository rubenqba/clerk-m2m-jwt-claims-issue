# Clerk M2M JWT claims repro

This reproduction shows an issue in `@clerk/backend` when verifying a JWT-format M2M token with custom claims.

The script:

- creates an M2M token in JWT format using `client.m2m.createToken(...)`
- includes custom claims such as `permissions`
- decodes the raw JWT payload
- verifies the same token with `client.m2m.verify({ token })`

The expected observation for the issue is that the raw JWT payload contains the custom claims, but the verified `M2MToken` returned by Clerk has `claims: null`.

## Setup

1. Install dependencies:
   `pnpm install`

2. Copy `env.example` to `.env`

3. Fill in:
   - `CLERK_MACHINE_SECRET_KEY` to create an M2M JWT token
   - `CLERK_CLIENT_SECRET_KEY` to verify the token

The script generates the M2M JWT itself. You do not need to provide a separate token in the environment.

## Run

`pnpm start`

## What this should show

- `Verified M2MToken` shows the result of `client.m2m.verify({ token })` and `claims` is `null`.
- `Comparison` prints the decoded raw JWT payload, which still includes the custom claims such as `permissions`.

That confirms the token itself carries the claims and that the loss happens during Clerk SDK verification/transformation of the JWT-format M2M token.