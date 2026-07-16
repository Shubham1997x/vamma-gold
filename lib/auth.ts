import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "vg_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  console.warn(
    "[auth] SESSION_SECRET is not set — using an insecure development fallback. Set it in .env before deploying."
  );
  return "vamma-gold-dev-secret-do-not-use-in-production";
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

function sign(value: string): string {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

function encodeToken(payload: { uid: number; exp: number }): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decodeToken(token: string): { uid: number; exp: number } | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  if (sign(body) !== signature) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (typeof payload.uid !== "number" || typeof payload.exp !== "number") return null;
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createSessionCookie(userId: number) {
  const token = encodeToken({ uid: userId, exp: Date.now() + SESSION_TTL_MS });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<{ userId: number } | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = decodeToken(token);
  if (!payload) return null;
  return { userId: payload.uid };
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  return decodeToken(token) !== null;
}

export { SESSION_COOKIE };
