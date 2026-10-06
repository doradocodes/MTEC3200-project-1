import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "google_session";
const STATE_COOKIE = "google_oauth_state";

export type GoogleSession = {
  refreshToken: string;
  selectedCalendarIds: string[];
};

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return createHash("sha256").update(secret).digest();
}

function seal(value: unknown) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]).toString("base64url");
}

function unseal<T>(token: string): T | null {
  try {
    const raw = Buffer.from(token, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", key(), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const data = Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]);
    return JSON.parse(data.toString("utf8")) as T;
  } catch {
    return null;
  }
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function readSession(): Promise<GoogleSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? unseal<GoogleSession>(token) : null;
}

export async function writeSession(session: GoogleSession) {
  (await cookies()).set(SESSION_COOKIE, seal(session), {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 180,
  });
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function setOAuthState(state: string) {
  (await cookies()).set(STATE_COOKIE, state, { ...cookieOptions, maxAge: 600 });
}

export async function consumeOAuthState() {
  const jar = await cookies();
  const state = jar.get(STATE_COOKIE)?.value ?? null;
  jar.delete(STATE_COOKIE);
  return state;
}
