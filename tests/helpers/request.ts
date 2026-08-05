import { NextRequest } from "next/server";

interface RequestOptions {
  headers?: Record<string, string>;
  cookies?: Record<string, string>;
  body?: unknown;
  /** Send a raw string body — used to exercise malformed-JSON handling. */
  rawBody?: string;
  method?: string;
}

/**
 * Builds a NextRequest for route-handler tests.
 */
export function makeRequest(url: string, options: RequestOptions = {}) {
  const { headers = {}, cookies = {}, body, rawBody, method } = options;

  const allHeaders: Record<string, string> = { ...headers };

  const cookieEntries = Object.entries(cookies);
  if (cookieEntries.length > 0) {
    allHeaders.cookie = cookieEntries
      .map(([key, value]) => `${key}=${value}`)
      .join("; ");
  }

  const hasBody = body !== undefined || rawBody !== undefined;
  if (hasBody && !allHeaders["content-type"]) {
    allHeaders["content-type"] = "application/json";
  }

  return new NextRequest(
    new Request(url, {
      method: method ?? (hasBody ? "POST" : "GET"),
      headers: allHeaders,
      body: rawBody ?? (body !== undefined ? JSON.stringify(body) : undefined),
    }),
  );
}

/**
 * The rate limiter is a module-level singleton shared by every test in a file,
 * so tests that must not throttle each other need a fresh client each time.
 * These counters hand out identifiers no other test will reuse.
 */
let ipCounter = 0;
let identityCounter = 0;

/** A unique, well-formed IPv4 address. */
export function uniqueIp(): string {
  ipCounter += 1;
  const third = Math.floor(ipCounter / 250) % 250;
  const fourth = (ipCounter % 250) + 1;
  return `10.0.${third}.${fourth}`;
}

/** A unique userId + fingerprint pair that passes the identity validators. */
export function uniqueIdentity() {
  identityCounter += 1;
  const suffix = String(identityCounter).padStart(6, "0");
  return {
    userId: `test-user-id-${suffix}`,
    fingerprint: `abcdef0123456789${suffix}`,
  };
}

/** Headers that make a request look like it came from a fresh, unique client. */
export function freshClientHeaders(): Record<string, string> {
  return {
    "x-forwarded-for": uniqueIp(),
    "user-agent": "vitest",
  };
}
