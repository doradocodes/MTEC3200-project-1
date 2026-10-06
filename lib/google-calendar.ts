import "server-only";

const SCOPE = "https://www.googleapis.com/auth/calendar.readonly";

export class GoogleAuthError extends Error {}

function config() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Google OAuth environment variables are not set");
  }
  return { clientId, clientSecret, redirectUri };
}

export function buildAuthUrl(state: string) {
  const { clientId, redirectUri } = config();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

async function tokenRequest(body: Record<string, string>) {
  const { clientId, clientSecret } = config();
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, ...body }),
    cache: "no-store",
  });
  if (!response.ok) throw new GoogleAuthError("Google rejected the authorization");
  return (await response.json()) as { access_token: string; refresh_token?: string };
}

export function exchangeCode(code: string) {
  return tokenRequest({
    code,
    grant_type: "authorization_code",
    redirect_uri: config().redirectUri,
  });
}

export async function refreshAccessToken(refreshToken: string) {
  return (await tokenRequest({ refresh_token: refreshToken, grant_type: "refresh_token" }))
    .access_token;
}

async function googleGet<T>(accessToken: string, url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (response.status === 401 || response.status === 403) {
    throw new GoogleAuthError("Google Calendar access was denied");
  }
  if (!response.ok) throw new Error(`Google Calendar request failed (${response.status})`);
  return (await response.json()) as T;
}

export type CalendarSummary = {
  id: string;
  name: string;
  primary: boolean;
};

export async function listCalendars(accessToken: string): Promise<CalendarSummary[]> {
  const data = await googleGet<{
    items?: { id: string; summary: string; summaryOverride?: string; primary?: boolean }[];
  }>(accessToken, "https://www.googleapis.com/calendar/v3/users/me/calendarList?minAccessRole=reader");
  return (data.items ?? []).map((item) => ({
    id: item.id,
    name: item.summaryOverride ?? item.summary,
    primary: Boolean(item.primary),
  }));
}

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  location: string | null;
  calendarId: string;
};

type RawEvent = {
  id: string;
  status?: string;
  summary?: string;
  location?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
};

export async function listEvents(
  accessToken: string,
  calendarId: string,
  timeMin: string,
  timeMax: string,
): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    timeMin,
    timeMax,
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "100",
  });
  const data = await googleGet<{ items?: RawEvent[] }>(
    accessToken,
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
  );
  return (data.items ?? [])
    .filter((event) => event.status !== "cancelled" && event.start)
    .map((event) => ({
      id: `${calendarId}:${event.id}`,
      title: event.summary || "Untitled event",
      start: event.start?.dateTime ?? `${event.start?.date}T00:00:00`,
      end: event.end?.dateTime ?? event.start?.dateTime ?? `${event.end?.date}T00:00:00`,
      allDay: !event.start?.dateTime,
      location: event.location?.trim() || null,
      calendarId,
    }));
}
