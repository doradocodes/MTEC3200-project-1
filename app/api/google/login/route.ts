import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { buildAuthUrl } from "@/lib/google-calendar";
import { setOAuthState } from "@/lib/google-session";

export async function GET() {
  const state = randomBytes(16).toString("hex");
  await setOAuthState(state);
  return NextResponse.redirect(buildAuthUrl(state));
}
