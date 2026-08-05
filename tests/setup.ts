/**
 * Global test setup. Runs before every test file.
 *
 * Vitest already sets NODE_ENV to "test"; jsdom matchers are registered by the
 * component tests themselves so this file stays environment-agnostic.
 */

// Point at an unroutable database before any module can read it. lib/utils.ts
// pulls in `dotenv/config`, which would otherwise hand the real connection
// string to anything that forgets to mock Prisma. dotenv does not overwrite
// variables that are already set, so this wins.
process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:1/test_db";
process.env.BASE_URL = "http://localhost:3000";
process.env.JWT_SECRET = "test-secret-that-is-long-enough-to-pass-validation";
