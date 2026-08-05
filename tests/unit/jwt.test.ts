import { afterEach, beforeEach, describe, expect, test } from "vitest";
import jwt from "jsonwebtoken";
import { signToken, verifyToken } from "@/lib/jwt";

const VALID_SECRET = "a-test-secret-that-is-comfortably-long-enough";
const PAYLOAD = { userId: 42, email: "admin@example.com" };

let originalSecret: string | undefined;

beforeEach(() => {
  originalSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = VALID_SECRET;
});

afterEach(() => {
  if (originalSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalSecret;
});

describe("signToken / verifyToken round trip", () => {
  test("recovers the payload it signed", () => {
    const decoded = verifyToken(signToken(PAYLOAD));
    expect(decoded).toMatchObject(PAYLOAD);
  });

  test("issues a token that expires in seven days", () => {
    const decoded = jwt.decode(signToken(PAYLOAD)) as jwt.JwtPayload;
    const sevenDays = 7 * 24 * 60 * 60;
    expect(decoded.exp! - decoded.iat!).toBe(sevenDays);
  });
});

describe("verifyToken rejects tokens it should not trust", () => {
  test("returns null for a malformed token", () => {
    expect(verifyToken("not-a-jwt")).toBeNull();
  });

  test("returns null for an empty token", () => {
    expect(verifyToken("")).toBeNull();
  });

  test("returns null for a token signed with a different secret", () => {
    const foreign = jwt.sign(PAYLOAD, "a-completely-different-secret-value-here");
    expect(verifyToken(foreign)).toBeNull();
  });

  test("returns null for an expired token", () => {
    const expired = jwt.sign(PAYLOAD, VALID_SECRET, { expiresIn: -10 });
    expect(verifyToken(expired)).toBeNull();
  });

  test("returns null when the payload has been tampered with", () => {
    const token = signToken(PAYLOAD);
    const [header, , signature] = token.split(".");
    const forgedPayload = Buffer.from(
      JSON.stringify({ userId: 1, email: "attacker@example.com" }),
    ).toString("base64url");

    expect(verifyToken(`${header}.${forgedPayload}.${signature}`)).toBeNull();
  });

  test("returns null for an unsigned 'none' algorithm token", () => {
    const header = Buffer.from(JSON.stringify({ alg: "none", typ: "JWT" })).toString(
      "base64url",
    );
    const payload = Buffer.from(JSON.stringify(PAYLOAD)).toString("base64url");
    expect(verifyToken(`${header}.${payload}.`)).toBeNull();
  });
});

describe("JWT_SECRET is required — no fallback", () => {
  test("signToken throws when the secret is missing", () => {
    delete process.env.JWT_SECRET;
    expect(() => signToken(PAYLOAD)).toThrow(/JWT_SECRET is not set/);
  });

  test("the error tells the operator how to generate one", () => {
    delete process.env.JWT_SECRET;
    expect(() => signToken(PAYLOAD)).toThrow(/openssl rand/);
  });

  test("verifyToken throws rather than silently failing closed", () => {
    // A missing secret is a deployment fault, not a bad token. It must not be
    // reported as 'unauthenticated', which would hide the misconfiguration.
    delete process.env.JWT_SECRET;
    expect(() => verifyToken("anything")).toThrow(/JWT_SECRET is not set/);
  });

  test("an empty secret is treated as missing", () => {
    process.env.JWT_SECRET = "";
    expect(() => signToken(PAYLOAD)).toThrow(/JWT_SECRET is not set/);
  });

  test.each([["short"], ["still-too-short-abcdefghij"]])(
    "rejects the weak secret %s",
    (secret) => {
      process.env.JWT_SECRET = secret;
      expect(() => signToken(PAYLOAD)).toThrow(/at least 32 characters/);
    },
  );

  test("accepts a secret of exactly 32 characters", () => {
    process.env.JWT_SECRET = "x".repeat(32);
    expect(() => signToken(PAYLOAD)).not.toThrow();
  });

  test("the old hardcoded fallback no longer verifies anything", () => {
    // Regression guard: this literal shipped in the source before the repo was
    // made public. A token minted with it must never be accepted.
    const leaked = "your-secret-key-change-in-production";
    const forged = jwt.sign(PAYLOAD, leaked);
    expect(verifyToken(forged)).toBeNull();
  });
});
