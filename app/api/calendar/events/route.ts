import { NextResponse, type NextRequest } from "next/server";
import {
  GoogleAuthError,
  listCalendars,
  listEvents,
  refreshAccessToken,
} from "@/lib/google-calendar";
import { clearSession, readSession } from "@/lib/google-session";

export async function GET(request: NextRequest) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "not_connected" }, { status: 401 });

  const timeMin = request.nextUrl.searchParams.get("timeMin");
  const timeMax = request.nextUrl.searchParams.get("timeMax");
  const min = Date.parse(timeMin ?? "");
  const max = Date.parse(timeMax ?? "");
  if (Number.isNaN(min) || Number.isNaN(max) || max <= min || max - min > 3 * 86_400_000) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const accessToken = await refreshAccessToken(session.refreshToken);
    let calendarIds = session.selectedCalendarIds;
    if (calendarIds.length === 0) {
      calendarIds = (await listCalendars(accessToken)).filter((c) => c.primary).map((c) => c.id);
    }
    const results = await Promise.all(
      calendarIds.map((id) => listEvents(accessToken, id, timeMin!, timeMax!)),
    );
    const events = results.flat().sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
    return NextResponse.json({ events, syncedAt: new Date().toISOString() });
  } catch (error) {
    if (error instanceof GoogleAuthError) {
      await clearSession();
      return NextResponse.json({ error: "auth_failed" }, { status: 401 });
    }
    return NextResponse.json({ error: "sync_failed" }, { status: 502 });
  }
}
