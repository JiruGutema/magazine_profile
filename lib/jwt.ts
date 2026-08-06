import jwt from "jsonwebtoken";

const JWT_EXPIRES_IN = "7d";
const MIN_SECRET_LENGTH = 32;

export interface JWTPayload {
  userId: number;
  email: string;
}

/**
 * Resolves the signing secret.
 *
 * There is deliberately no default value: a fallback secret in a public
 * repository lets anyone forge an admin token. Resolved lazily rather than at
 * module scope so `next build` still works in environments without runtime
 * secrets (CI, a fresh clone).
 */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. Generate one with `openssl rand -base64 48` and add it to your environment.",
    );
  }

  if (secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET must be at least ${MIN_SECRET_LENGTH} characters (got ${secret.length}).`,
    );
  }

  return secret;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): JWTPayload | null {
  // Resolved outside the try block so a misconfigured secret surfaces as a
  // thrown error instead of being indistinguishable from a bad token.
  const secret = getJwtSecret();

  try {
    return jwt.verify(token, secret) as JWTPayload;
  } catch {
    // An expired or tampered token is normal traffic, not an error worth
    // logging on every request. The null return is handled by every caller.
    return null;
  }
}
