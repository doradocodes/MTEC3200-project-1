import { NextResponse, type NextRequest } from "next/server";
import { GoogleAuthError, listCalendars, refreshAccessToken } from "@/lib/google-calendar";
import { clearSession, readSession, writeSession } from "@/lib/google-session";

export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "not_connected" }, { status: 401 });

  try {
    const calendars = await listCalendars(await refreshAccessToken(session.refreshToken));
    let selected = session.selectedCalendarIds.filter((id) => calendars.some((c) => c.id === id));
    if (selected.length === 0) {
      selected = calendars.filter((c) => c.primary).map((c) => c.id);
    }
    return NextResponse.json({ calendars, selectedCalendarIds: selected });
  } catch (error) {
    if (error instanceof GoogleAuthError) {
      await clearSession();
      return NextResponse.json({ error: "auth_failed" }, { status: 401 });
    }
    return NextResponse.json({ error: "sync_failed" }, { status: 502 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "not_connected" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { calendarIds?: unknown } | null;
  const ids = body?.calendarIds;
  if (!Array.isArray(ids) || ids.length > 50 || !ids.every((id) => typeof id === "string")) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }
  await writeSession({ ...session, selectedCalendarIds: ids });
  return NextResponse.json({ ok: true });
}
