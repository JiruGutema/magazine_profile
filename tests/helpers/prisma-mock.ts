import { vi } from "vitest";

/**
 * A hand-rolled Prisma stand-in.
 *
 * Every model method is a `vi.fn()` so tests can set per-case return values.
 * `$transaction` invokes its callback with the mock itself, which matches how
 * the routes use it: they only ever call model methods on the `tx` handle.
 */
export function createPrismaMock() {
  const model = () => ({
    findMany: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    upsert: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
  });

  const mock = {
    blogPost: model(),
    blogPostReaction: model(),
    articleSection: model(),
    project: model(),
    siteContent: model(),
    user: model(),
    $transaction: vi.fn(),
    $disconnect: vi.fn(),
  };

  mock.$transaction.mockImplementation(
    async (arg: unknown) =>
      typeof arg === "function"
        ? await (arg as (tx: typeof mock) => Promise<unknown>)(mock)
        : await Promise.all(arg as Promise<unknown>[]),
  );

  return mock;
}

export type PrismaMock = ReturnType<typeof createPrismaMock>;
