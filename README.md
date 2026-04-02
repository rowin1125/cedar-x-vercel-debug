## How to Replicate: CedarJS v3 + Prisma v7 Serverless Deployment Failure

### Environment

- CedarJS: v3.1.0 (upgraded from v2.8.x)
- Prisma: v7.5.0
- Deployment target: Vercel (serverless functions)

### Setup

Follow the official CedarJS v3 upgrade guide and the Prisma v7 migration guide. Use the recommended Prisma generator config from the Cedar docs:

```prisma
generator client {
  provider               = "prisma-client"
  output                 = "./generated/prisma"
  moduleFormat           = "cjs"
  generatedFileExtension = "mts"
  importFileExtension    = "mts"
}
```

### Steps to Reproduce

1. Upgrade a CedarJS project from v2.8 to v3.1.0
2. Apply the Prisma v7 generator config above
3. Run `yarn cedar prisma generate`
4. Run `yarn cedar build` — build completes successfully
5. Run `yarn rw setup deploy vercel` to configure Vercel deployment
6. Setup an external db, for example DigitalOcean Managed PostgreSQL. Make sure to follow this: [Digital ocean setup](https://cedarjs.com/docs/connection-pooling#digital-ocean)
7. Deploy to Vercel and make sure to use the Redwoodjs preset present in Vercel. You need a pro account in order to upload more than 12 serverless functions on the hobby plan 😵.
8. Go to the `/user-examples` route and go to the logs in vercel

### Observed Error

```
Error [ERR_REQUIRE_ESM]: require() of ES Module /var/task/api/db/generated/prisma/client.mts
from /var/task/api/dist/lib/db.js not supported.
```

### Root Cause Analysis (my pov)

Cedar's esbuild step only compiles files under `api/src/`. The generated Prisma client lives in `api/db/generated/prisma/` and is **never compiled** — it is deployed as raw `.mts` TypeScript source files.

At runtime, `api/dist/lib/db.js` attempts to `require()` `client.mts`. Node.js unconditionally treats `.mts` files as ESM regardless of `moduleFormat`, making CJS `require()` of them impossible.

### Questions

- Should Cedar's build pipeline compile the generated Prisma client files alongside `api/src/` so that plain JavaScript (not TypeScript source) is deployed?

### Notes

- The issue only appears on deployment — `yarn cedar build` succeeds locally
- CedarJS v2.8.x does not have this problem
- `@vercel/nft` (Vercel's file tracer) also does not trace imports inside `.mts` files, causing a secondary issue where `@prisma/client` is excluded from the serverless bundle entirely
