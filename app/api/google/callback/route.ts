import { NextResponse, type NextRequest } from "next/server";
import { exchangeCode } from "@/lib/google-calendar";
import { consumeOAuthState, writeSession } from "@/lib/google-session";

export async function GET(request: NextRequest) {
  const home = new URL("/", process.env.GOOGLE_REDIRECT_URI ?? request.url);
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expected = await consumeOAuthState();

  if (!code || !state || state !== expected) {
    home.searchParams.set("calendar_error", "denied");
    return NextResponse.redirect(home);
  }

  try {
    const tokens = await exchangeCode(code);
    if (!tokens.refresh_token) throw new Error("No refresh token");
    await writeSession({ refreshToken: tokens.refresh_token, selectedCalendarIds: [] });
  } catch {
    home.searchParams.set("calendar_error", "denied");
  }
  return NextResponse.redirect(home);
}
