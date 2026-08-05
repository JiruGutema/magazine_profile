# Tests

[Vitest](https://vitest.dev) suite covering the library modules, the API route
handlers, and the HTML sanitisation boundary.

```bash
npm test              # run once
npm run test:watch    # re-run on change
npm run test:coverage # run with a coverage report (also enforces thresholds)
```

## Layout

```
tests/
├── setup.ts                 # global env setup, runs before every file
├── helpers/
│   ├── prisma-mock.ts       # Prisma stand-in built from vi.fn()s
│   └── request.ts           # NextRequest builder + unique-client helpers
├── unit/                    # pure logic, no I/O
├── integration/             # route handlers with Prisma and auth mocked
└── components/              # React rendering in jsdom
```

## Conventions

**No database.** `tests/setup.ts` overwrites `DATABASE_URL` with an unroutable
address before any module loads, and every file that touches persistence mocks
`@/lib/prisma`. A test that forgets the mock fails to connect rather than
reaching the real database.

**Mocked Prisma is cast to a loose type.** Route tests import the module and
re-expose it as `PrismaMock`:

```ts
const prisma = realPrisma as unknown as PrismaMock;
```

Without the cast, `vi.mocked()` infers the real Prisma row types and every
fixture has to spell out columns the test does not care about.

**The rate limiter is a singleton.** `lib/rate-limit.ts` keeps its counters in
module state shared by every test in a file. Tests that must not throttle each
other take a fresh client from `helpers/request.ts`:

```ts
const { userId, fingerprint } = uniqueIdentity();
const ip = uniqueIp();
```

Throttling tests deliberately reuse one address, and use `vi.useFakeTimers()`
when they need to step past a cooldown without sleeping.

## Coverage

`npm run test:coverage` enforces 80% lines/functions/statements and 75%
branches over `lib/` and `app/api/`. Excluded: generated Prisma output, plain
type modules, the content defaults data file, and `lib/client-fingerprint.ts`
(browser-only; exercised indirectly).

## What is not covered here

- Page components and the admin console UI — no rendering tests beyond the
  `<Html />` sanitisation boundary.
- End-to-end browser flows. `rules/web/testing.md` calls for Playwright visual
  regression at 320/768/1024/1440; that suite does not exist yet.
