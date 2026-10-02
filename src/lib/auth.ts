import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "rasma-arts-platform-secret-2026";
export const TOKEN_COOKIE = "rasma_token";
export const TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export interface TokenPayload {
  userId: string;
  role: string;
  iat: number;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const test = crypto.scryptSync(password, salt, 64);
    const expected = Buffer.from(hash, "hex");
    if (test.length !== expected.length) return false;
    return crypto.timingSafeEqual(test, expected);
  } catch {
    return false;
  }
}

export function signToken(userId: string, role: string): string {
  const payload: TokenPayload = {
    userId,
    role,
    iat: Date.now(),
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("base64url");
  return `${data}.${sig}`;
}

export function verifyToken(token: string | undefined | null): TokenPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(data, "base64url").toString("utf-8")
    ) as TokenPayload;
    // token expiry check (30 days)
    if (Date.now() - payload.iat > TOKEN_MAX_AGE * 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

// Public fields returned to the client — never leak password
export const publicUserSelect = {
  id: true,
  name: true,
  slug: true,
  phone: true,
  isGraduate: true,
  college: true,
  bio: true,
  journey: true,
  passion: true,
  photo: true,
  whatsappEnabled: true,
  whatsappNumber: true,
  role: true,
  status: true,
  suspendReason: true,
  createdAt: true,
} as const;
