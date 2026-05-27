# Clerk M2M JWT claims repro

This reproduction shows that a JWT-format M2M token can contain custom claims in the raw JWT payload, while the object returned by `@clerk/backend` from `client.m2m.verify({ token })` has `claims = null`.

## Setup

1. Install dependencies:
   `pnpm install`

2. Copy `.env.example` to `.env`

3. Fill in:
   - `CLERK_SECRET_KEY`
   - `M2M_JWT`

Use a fresh valid M2M JWT that includes custom claims such as `permissions`.

## Run

`pnpm start`

## What this should show

- The raw JWT payload includes custom claims.
- The verified `M2MToken` returned by Clerk has `claims: null`.

That confirms the token itself carries the claims, and the loss happens during SDK transformation.