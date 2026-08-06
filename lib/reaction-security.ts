import { NextRequest } from "next/server";
import crypto from "crypto";

export interface ClientIdentity {
  ip: string;
  userId: string;
  fingerprint: string;
  userAgent: string;
  userKey: string;     // hash(postId, userId)
  deviceKey: string;   // hash(postId, ip, fingerprint)
  ipKey: string;       // hash(postId, ip)
}

/**
 * Extracts and normalizes the client IP address from request headers.
 */
export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0].trim();
    if (firstIp) return sanitizeIp(firstIp);
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return sanitizeIp(realIp.trim());

  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return sanitizeIp(cfConnectingIp.trim());

  const fastlyClientIp = req.headers.get("fastly-client-ip");
  if (fastlyClientIp) return sanitizeIp(fastlyClientIp.trim());

  const clientIp = req.headers.get("x-client-ip");
  if (clientIp) return sanitizeIp(clientIp.trim());

  return "127.0.0.1";
}

function sanitizeIp(ip: string): string {
  // Strip IPv6 prefix if present (e.g., ::ffff:192.168.1.1)
  if (ip.startsWith("::ffff:")) {
    ip = ip.substring(7);
  }
  // Sanitize characters
  return ip.replace(/[^a-fA-F0-9:.]/g, "").slice(0, 45) || "127.0.0.1";
}

/**
 * Validates and normalizes client-provided identifiers.
 */
export function validateAndExtractIdentity(
  req: NextRequest,
  postId: number,
  bodyUserId?: string | null,
  bodyFingerprint?: string | null,
): ClientIdentity {
  const ip = getClientIp(req);
  const userAgent = (req.headers.get("user-agent") || "unknown").slice(0, 255);

  // User ID: from body, header, or cookie
  let rawUserId =
    bodyUserId ||
    req.headers.get("x-user-id") ||
    req.cookies.get("blog_uid")?.value ||
    "";

  // Validate userId format (alphanumeric, hyphens, underscores, 16-64 chars)
  if (
    typeof rawUserId !== "string" ||
    !/^[a-zA-Z0-9_-]{16,64}$/.test(rawUserId)
  ) {
    // Generate fallback UUID if invalid/missing
    rawUserId = crypto.randomUUID();
  }

  // Fingerprint: from body or header
  let rawFingerprint =
    bodyFingerprint ||
    req.headers.get("x-client-fingerprint") ||
    "";

  if (
    typeof rawFingerprint !== "string" ||
    !/^[a-fA-F0-9_-]{16,128}$/.test(rawFingerprint)
  ) {
    // Fallback pseudo-fingerprint from User-Agent + IP subnet
    rawFingerprint = crypto
      .createHash("sha256")
      .update(`${userAgent}:${ip.split(".").slice(0, 3).join(".")}`)
      .digest("hex");
  }

  // Generate deterministic hashed identity keys for DB & anti-spam tracking
  const userKey = crypto
    .createHash("sha256")
    .update(`post:${postId}:user:${rawUserId}`)
    .digest("hex");

  const deviceKey = crypto
    .createHash("sha256")
    .update(`post:${postId}:ip:${ip}:fp:${rawFingerprint}`)
    .digest("hex");

  const ipKey = crypto
    .createHash("sha256")
    .update(`post:${postId}:ip:${ip}`)
    .digest("hex");

  return {
    ip,
    userId: rawUserId,
    fingerprint: rawFingerprint,
    userAgent,
    userKey,
    deviceKey,
    ipKey,
  };
}
