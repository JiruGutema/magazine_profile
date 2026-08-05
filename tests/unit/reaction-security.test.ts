import { describe, expect, test } from "vitest";
import {
  getClientIp,
  validateAndExtractIdentity,
} from "@/lib/reaction-security";
import { makeRequest } from "../helpers/request";

const SHA256_HEX = /^[a-f0-9]{64}$/;
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const url = "https://example.com/api/blogs/reaction";

function requestWithHeaders(headers: Record<string, string>) {
  return makeRequest(url, { headers });
}

describe("getClientIp — header precedence", () => {
  test("prefers x-forwarded-for", () => {
    const req = requestWithHeaders({
      "x-forwarded-for": "1.2.3.4",
      "x-real-ip": "9.9.9.9",
    });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  test("takes the left-most hop from a forwarded chain", () => {
    const req = requestWithHeaders({
      "x-forwarded-for": "1.2.3.4, 5.6.7.8, 9.10.11.12",
    });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  test.each([
    ["x-real-ip"],
    ["cf-connecting-ip"],
    ["fastly-client-ip"],
    ["x-client-ip"],
  ])("falls back to %s when x-forwarded-for is absent", (header) => {
    expect(getClientIp(requestWithHeaders({ [header]: "8.8.8.8" }))).toBe(
      "8.8.8.8",
    );
  });

  test("skips an empty x-forwarded-for and uses the next header", () => {
    const req = requestWithHeaders({
      "x-forwarded-for": "",
      "x-real-ip": "8.8.8.8",
    });
    expect(getClientIp(req)).toBe("8.8.8.8");
  });

  test("skips a forwarded chain whose first hop is blank", () => {
    const req = requestWithHeaders({
      "x-forwarded-for": ", 5.6.7.8",
      "x-real-ip": "8.8.8.8",
    });
    expect(getClientIp(req)).toBe("8.8.8.8");
  });

  test("defaults to loopback when no header identifies the client", () => {
    expect(getClientIp(requestWithHeaders({}))).toBe("127.0.0.1");
  });
});

describe("getClientIp — normalisation", () => {
  test("unwraps IPv4-mapped IPv6 addresses", () => {
    expect(
      getClientIp(requestWithHeaders({ "x-forwarded-for": "::ffff:192.168.1.1" })),
    ).toBe("192.168.1.1");
  });

  test("keeps a genuine IPv6 address", () => {
    expect(
      getClientIp(requestWithHeaders({ "x-forwarded-for": "2001:db8::1" })),
    ).toBe("2001:db8::1");
  });

  test("trims surrounding whitespace", () => {
    expect(
      getClientIp(requestWithHeaders({ "x-forwarded-for": "  1.2.3.4  " })),
    ).toBe("1.2.3.4");
  });

  test("strips characters that cannot appear in an address", () => {
    const ip = getClientIp(
      requestWithHeaders({ "x-forwarded-for": "1.2.3.4'; DROP TABLE--" }),
    );
    expect(ip).not.toMatch(/[^a-fA-F0-9:.]/);
    expect(ip.startsWith("1.2.3.4")).toBe(true);
  });

  test("falls back to loopback when nothing survives sanitisation", () => {
    expect(
      getClientIp(requestWithHeaders({ "x-forwarded-for": "!!!???" })),
    ).toBe("127.0.0.1");
  });

  test("caps the length so a huge header cannot become a cache key", () => {
    const ip = getClientIp(
      requestWithHeaders({ "x-forwarded-for": "1".repeat(500) }),
    );
    expect(ip.length).toBeLessThanOrEqual(45);
  });
});

describe("validateAndExtractIdentity — userId", () => {
  test("keeps a well-formed client-supplied id", () => {
    const identity = validateAndExtractIdentity(
      requestWithHeaders({}),
      1,
      "valid-user-id-1234567",
    );
    expect(identity.userId).toBe("valid-user-id-1234567");
  });

  test.each([
    ["short", "under 16 characters"],
    ["has spaces in it here", "spaces"],
    ["has/slashes/in/it/here", "disallowed punctuation"],
    ["x".repeat(65), "over 64 characters"],
    ["", "empty"],
  ])("replaces the invalid id %s (%s) with a fresh UUID", (candidate) => {
    const identity = validateAndExtractIdentity(
      requestWithHeaders({}),
      1,
      candidate,
    );
    expect(identity.userId).toMatch(UUID_V4);
  });

  test("reads the id from the x-user-id header when the body omits it", () => {
    const identity = validateAndExtractIdentity(
      requestWithHeaders({ "x-user-id": "header-user-id-12345" }),
      1,
    );
    expect(identity.userId).toBe("header-user-id-12345");
  });

  test("reads the id from the blog_uid cookie as a last resort", () => {
    const req = makeRequest(url, { cookies: { blog_uid: "cookie-user-id-12345" } });
    expect(validateAndExtractIdentity(req, 1).userId).toBe("cookie-user-id-12345");
  });

  test("the body wins over the header", () => {
    const identity = validateAndExtractIdentity(
      requestWithHeaders({ "x-user-id": "header-user-id-12345" }),
      1,
      "body-user-id-1234567",
    );
    expect(identity.userId).toBe("body-user-id-1234567");
  });
});

describe("validateAndExtractIdentity — fingerprint", () => {
  test("keeps a well-formed hex fingerprint", () => {
    const identity = validateAndExtractIdentity(
      requestWithHeaders({}),
      1,
      "valid-user-id-1234567",
      "abcdef0123456789abcd",
    );
    expect(identity.fingerprint).toBe("abcdef0123456789abcd");
  });

  test.each([
    ["tooshort", "under 16 characters"],
    ["nothexadecimalzzzz", "non-hex characters"],
    ["", "empty"],
  ])("derives a fallback for the invalid fingerprint %s (%s)", (candidate) => {
    const identity = validateAndExtractIdentity(
      requestWithHeaders({ "user-agent": "Mozilla/5.0" }),
      1,
      "valid-user-id-1234567",
      candidate,
    );
    expect(identity.fingerprint).toMatch(SHA256_HEX);
  });

  test("reads the fingerprint from the x-client-fingerprint header", () => {
    const identity = validateAndExtractIdentity(
      requestWithHeaders({ "x-client-fingerprint": "0123456789abcdef0123" }),
      1,
      "valid-user-id-1234567",
    );
    expect(identity.fingerprint).toBe("0123456789abcdef0123");
  });

  test("the derived fallback is stable for the same UA and IP subnet", () => {
    const build = () =>
      validateAndExtractIdentity(
        requestWithHeaders({
          "user-agent": "Mozilla/5.0",
          "x-forwarded-for": "203.0.113.7",
        }),
        1,
        "valid-user-id-1234567",
        "bad",
      ).fingerprint;
    expect(build()).toBe(build());
  });

  test("the derived fallback ignores the final IP octet", () => {
    const forIp = (ip: string) =>
      validateAndExtractIdentity(
        requestWithHeaders({ "user-agent": "Mozilla/5.0", "x-forwarded-for": ip }),
        1,
        "valid-user-id-1234567",
        "bad",
      ).fingerprint;
    // Same /24, so the same household should collapse to one fingerprint.
    expect(forIp("203.0.113.7")).toBe(forIp("203.0.113.9"));
    expect(forIp("203.0.113.7")).not.toBe(forIp("198.51.100.7"));
  });
});

describe("validateAndExtractIdentity — derived keys", () => {
  const identityFor = (postId: number, ip = "203.0.113.7") =>
    validateAndExtractIdentity(
      requestWithHeaders({ "x-forwarded-for": ip, "user-agent": "Mozilla/5.0" }),
      postId,
      "valid-user-id-1234567",
      "abcdef0123456789abcd",
    );

  test("all three keys are sha256 digests", () => {
    const identity = identityFor(1);
    expect(identity.userKey).toMatch(SHA256_HEX);
    expect(identity.deviceKey).toMatch(SHA256_HEX);
    expect(identity.ipKey).toMatch(SHA256_HEX);
  });

  test("the keys are distinct from one another", () => {
    const { userKey, deviceKey, ipKey } = identityFor(1);
    expect(new Set([userKey, deviceKey, ipKey]).size).toBe(3);
  });

  test("the same client on the same post derives the same keys", () => {
    expect(identityFor(1)).toEqual(identityFor(1));
  });

  test("the keys are scoped per post, so a vote cannot span articles", () => {
    const first = identityFor(1);
    const second = identityFor(2);
    expect(second.userKey).not.toBe(first.userKey);
    expect(second.deviceKey).not.toBe(first.deviceKey);
    expect(second.ipKey).not.toBe(first.ipKey);
  });

  test("a different IP changes the device and IP keys but not the user key", () => {
    const first = identityFor(1, "203.0.113.7");
    const second = identityFor(1, "198.51.100.7");
    expect(second.userKey).toBe(first.userKey);
    expect(second.deviceKey).not.toBe(first.deviceKey);
    expect(second.ipKey).not.toBe(first.ipKey);
  });

  test("no raw identifier leaks into the hashed keys", () => {
    const identity = identityFor(1);
    for (const key of [identity.userKey, identity.deviceKey, identity.ipKey]) {
      expect(key).not.toContain("valid-user-id");
      expect(key).not.toContain("203.0.113.7");
    }
  });
});

describe("validateAndExtractIdentity — user agent", () => {
  test("records the supplied user agent", () => {
    const identity = validateAndExtractIdentity(
      requestWithHeaders({ "user-agent": "Mozilla/5.0" }),
      1,
    );
    expect(identity.userAgent).toBe("Mozilla/5.0");
  });

  test("substitutes a placeholder when the header is absent", () => {
    expect(validateAndExtractIdentity(requestWithHeaders({}), 1).userAgent).toBe(
      "unknown",
    );
  });

  test("truncates an oversized user agent to the column width", () => {
    const identity = validateAndExtractIdentity(
      requestWithHeaders({ "user-agent": "U".repeat(1000) }),
      1,
    );
    expect(identity.userAgent).toHaveLength(255);
  });
});
