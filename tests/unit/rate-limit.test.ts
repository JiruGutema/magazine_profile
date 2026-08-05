import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { rateLimiter } from "@/lib/rate-limit";

/**
 * `rateLimiter` is a module singleton, so every test uses its own namespace to
 * avoid inheriting counters from its neighbours.
 */

const WINDOW_MS = 60_000;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("check — allowance within a window", () => {
  test("allows requests up to the limit", () => {
    for (let i = 0; i < 3; i++) {
      expect(rateLimiter.check("t_allow", "k", 3, WINDOW_MS).allowed).toBe(true);
    }
  });

  test("blocks the request that exceeds the limit", () => {
    for (let i = 0; i < 3; i++) rateLimiter.check("t_block", "k", 3, WINDOW_MS);
    expect(rateLimiter.check("t_block", "k", 3, WINDOW_MS).allowed).toBe(false);
  });

  test("counts down the remaining allowance", () => {
    expect(rateLimiter.check("t_rem", "k", 3, WINDOW_MS).remaining).toBe(2);
    expect(rateLimiter.check("t_rem", "k", 3, WINDOW_MS).remaining).toBe(1);
    expect(rateLimiter.check("t_rem", "k", 3, WINDOW_MS).remaining).toBe(0);
  });

  test("reports zero remaining once blocked", () => {
    for (let i = 0; i < 2; i++) rateLimiter.check("t_rem0", "k", 2, WINDOW_MS);
    const blocked = rateLimiter.check("t_rem0", "k", 2, WINDOW_MS);
    expect(blocked.remaining).toBe(0);
  });

  test("echoes the configured limit back to the caller", () => {
    expect(rateLimiter.check("t_limit", "k", 7, WINDOW_MS).limit).toBe(7);
  });

  test("a limit of one allows exactly one request", () => {
    expect(rateLimiter.check("t_one", "k", 1, WINDOW_MS).allowed).toBe(true);
    expect(rateLimiter.check("t_one", "k", 1, WINDOW_MS).allowed).toBe(false);
  });
});

describe("check — isolation", () => {
  test("tracks each key separately", () => {
    for (let i = 0; i < 3; i++) rateLimiter.check("t_keys", "a", 3, WINDOW_MS);
    expect(rateLimiter.check("t_keys", "a", 3, WINDOW_MS).allowed).toBe(false);
    expect(rateLimiter.check("t_keys", "b", 3, WINDOW_MS).allowed).toBe(true);
  });

  test("tracks each namespace separately", () => {
    for (let i = 0; i < 3; i++) rateLimiter.check("t_ns_one", "k", 3, WINDOW_MS);
    expect(rateLimiter.check("t_ns_one", "k", 3, WINDOW_MS).allowed).toBe(false);
    expect(rateLimiter.check("t_ns_two", "k", 3, WINDOW_MS).allowed).toBe(true);
  });
});

describe("check — window expiry", () => {
  test("allows again once the window has passed", () => {
    for (let i = 0; i < 2; i++) rateLimiter.check("t_exp", "k", 2, WINDOW_MS);
    expect(rateLimiter.check("t_exp", "k", 2, WINDOW_MS).allowed).toBe(false);

    vi.advanceTimersByTime(WINDOW_MS + 1);

    const afterReset = rateLimiter.check("t_exp", "k", 2, WINDOW_MS);
    expect(afterReset.allowed).toBe(true);
    expect(afterReset.remaining).toBe(1);
  });

  test("stays blocked while still inside the window", () => {
    for (let i = 0; i < 2; i++) rateLimiter.check("t_inside", "k", 2, WINDOW_MS);
    vi.advanceTimersByTime(WINDOW_MS - 1000);
    expect(rateLimiter.check("t_inside", "k", 2, WINDOW_MS).allowed).toBe(false);
  });

  test("reports a retry hint that shrinks as the window drains", () => {
    for (let i = 0; i < 2; i++) rateLimiter.check("t_retry", "k", 2, WINDOW_MS);
    const early = rateLimiter.check("t_retry", "k", 2, WINDOW_MS);

    vi.advanceTimersByTime(30_000);
    const later = rateLimiter.check("t_retry", "k", 2, WINDOW_MS);

    expect(early.retryAfterSeconds).toBeGreaterThan(later.retryAfterSeconds);
    expect(later.retryAfterSeconds).toBeGreaterThanOrEqual(1);
  });
});

describe("check — minimum interval between requests", () => {
  const COOLDOWN_MS = 1_000;

  test("blocks a second request inside the cooldown", () => {
    rateLimiter.check("t_cool", "k", 100, WINDOW_MS, COOLDOWN_MS);
    const immediate = rateLimiter.check("t_cool", "k", 100, WINDOW_MS, COOLDOWN_MS);
    expect(immediate.allowed).toBe(false);
    expect(immediate.reason).toMatch(/too frequent/i);
  });

  test("allows the next request once the cooldown elapses", () => {
    rateLimiter.check("t_cool2", "k", 100, WINDOW_MS, COOLDOWN_MS);
    vi.advanceTimersByTime(COOLDOWN_MS + 1);
    expect(
      rateLimiter.check("t_cool2", "k", 100, WINDOW_MS, COOLDOWN_MS).allowed,
    ).toBe(true);
  });

  test("always suggests waiting at least one second", () => {
    rateLimiter.check("t_cool3", "k", 100, WINDOW_MS, COOLDOWN_MS);
    const blocked = rateLimiter.check("t_cool3", "k", 100, WINDOW_MS, COOLDOWN_MS);
    expect(blocked.retryAfterSeconds).toBeGreaterThanOrEqual(1);
  });

  test("a zero cooldown imposes no spacing", () => {
    rateLimiter.check("t_nocool", "k", 100, WINDOW_MS, 0);
    expect(rateLimiter.check("t_nocool", "k", 100, WINDOW_MS, 0).allowed).toBe(
      true,
    );
  });
});

describe("periodic cleanup", () => {
  const SWEEP_INTERVAL_MS = 2 * 60 * 1000;

  /**
   * The sweep runs on an interval created in the constructor, so the module has
   * to be built fresh while fake timers are already installed. The singleton is
   * also cached on `global` outside production, which has to be cleared first.
   */
  async function freshLimiter() {
    delete (globalThis as Record<string, unknown>).blogRateLimiter;
    vi.resetModules();
    const module = await import("@/lib/rate-limit");
    return module.rateLimiter;
  }

  afterEach(() => {
    delete (globalThis as Record<string, unknown>).blogRateLimiter;
  });

  test("keeps records whose window is still open", async () => {
    const limiter = await freshLimiter();
    limiter.check("t_sweep_keep", "k", 1, 60 * 60 * 1000);

    vi.advanceTimersByTime(SWEEP_INTERVAL_MS + 1);

    // Swept but not expired, so the caller is still inside their budget.
    expect(limiter.check("t_sweep_keep", "k", 1, 60 * 60 * 1000).allowed).toBe(
      false,
    );
  });

  test("evicts records long past their window", async () => {
    const limiter = await freshLimiter();
    limiter.check("t_sweep_drop", "k", 1, 1000);

    vi.advanceTimersByTime(SWEEP_INTERVAL_MS + 1);

    expect(limiter.check("t_sweep_drop", "k", 1, 1000).allowed).toBe(true);
  });
});

describe("check — blocked response shape", () => {
  test("explains why the request was refused", () => {
    for (let i = 0; i < 2; i++) rateLimiter.check("t_shape", "k", 2, WINDOW_MS);
    const blocked = rateLimiter.check("t_shape", "k", 2, WINDOW_MS);

    expect(blocked.reason).toMatch(/rate limit exceeded/i);
    expect(blocked.resetTime).toBeGreaterThan(Date.now());
  });

  test("an allowed response carries no reason and no retry hint", () => {
    const allowed = rateLimiter.check("t_ok", "k", 5, WINDOW_MS);
    expect(allowed.reason).toBeUndefined();
    expect(allowed.retryAfterSeconds).toBe(0);
  });
});
