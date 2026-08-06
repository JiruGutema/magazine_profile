/**
 * Client-side anonymous user identification and lightweight browser fingerprinting.
 * Privacy-friendly, fast, and deterministic per browser environment.
 */

let cachedFingerprint: string | null = null;

/**
 * Returns or generates a persistent random visitor ID stored in localStorage.
 */
export function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const STORAGE_KEY = "blog_visitor_id";
  try {
    let visitorId = localStorage.getItem(STORAGE_KEY);
    if (
      visitorId &&
      typeof visitorId === "string" &&
      /^[a-zA-Z0-9_-]{16,64}$/.test(visitorId)
    ) {
      return visitorId;
    }

    // Generate random UUID
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      visitorId = crypto.randomUUID();
    } else {
      visitorId =
        "usr_" +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Date.now().toString(36);
    }

    localStorage.setItem(STORAGE_KEY, visitorId);
    return visitorId;
  } catch {
    // If localStorage is blocked in private mode
    return "anon_" + Math.random().toString(36).substring(2, 15);
  }
}

/**
 * Generates a lightweight browser fingerprint hash based on hardware and browser characteristics.
 */
export async function getBrowserFingerprint(): Promise<string> {
  if (typeof window === "undefined") {
    return "";
  }

  if (cachedFingerprint) {
    return cachedFingerprint;
  }

  try {
    const components: string[] = [];

    // Screen attributes
    if (typeof screen !== "undefined") {
      components.push(
        `${screen.width}x${screen.height}x${screen.colorDepth || 24}x${screen.pixelDepth || 24}`,
      );
    }

    // Window & device
    components.push(`dpr:${window.devicePixelRatio || 1}`);
    components.push(`tz:${Intl.DateTimeFormat().resolvedOptions().timeZone || ""}`);
    components.push(`tzo:${new Date().getTimezoneOffset()}`);

    // Navigator attributes
    if (typeof navigator !== "undefined") {
      components.push(`ua:${navigator.userAgent || ""}`);
      components.push(`lang:${navigator.language || ""}`);
      components.push(`hc:${navigator.hardwareConcurrency || 0}`);
      components.push(`mtp:${navigator.maxTouchPoints || 0}`);
      components.push(`plat:${navigator.platform || ""}`);
    }

    // Canvas fingerprinting (subtle rendering differences)
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 50;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial', sans-serif";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText("JiruPortfolio.blog, 2026", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("Fingerprint ⚡", 4, 17);
        components.push(`canvas:${canvas.toDataURL().slice(-50)}`);
      }
    } catch {
      // Ignore canvas errors
    }

    const rawString = components.join("|||");

    // Hash the components with SHA-256
    if (typeof crypto !== "undefined" && crypto.subtle && crypto.subtle.digest) {
      const msgBuffer = new TextEncoder().encode(rawString);
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      cachedFingerprint = hashHex;
      return hashHex;
    }

    // Simple fast fallback hash
    let hash = 0;
    for (let i = 0; i < rawString.length; i++) {
      const char = rawString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const fallbackHash = Math.abs(hash).toString(16).padStart(16, "0");
    cachedFingerprint = fallbackHash;
    return fallbackHash;
  } catch {
    return "fp_fallback_" + Date.now().toString(16);
  }
}
