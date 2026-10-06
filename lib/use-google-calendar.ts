"use client";

import { useCallback, useEffect, useState } from "react";
import type { CalendarEvent, CalendarSummary } from "@/lib/google-calendar";

export type CalendarStatus = "loading" | "disconnected" | "connected";
export type SyncError = "auth_failed" | "sync_failed" | "denied" | null;

const REFRESH_MS = 60_000;

function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { timeMin: start.toISOString(), timeMax: end.toISOString() };
}

export function useGoogleCalendar() {
  const [status, setStatus] = useState<CalendarStatus>("loading");
  const [error, setError] = useState<SyncError>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [calendars, setCalendars] = useState<CalendarSummary[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const sync = useCallback(async () => {
    try {
      const response = await fetch(`/api/calendar/events?${new URLSearchParams(todayRange())}`, {
        cache: "no-store",
      });
      if (response.status === 401) {
        const body = (await response.json().catch(() => ({}))) as { error?: string };
        setEvents([]);
        setLastSyncedAt(null);
        setStatus("disconnected");
        setError(body.error === "auth_failed" ? "auth_failed" : null);
        return;
      }
      if (!response.ok) throw new Error("sync failed");
      const data = (await response.json()) as { events: CalendarEvent[]; syncedAt: string };
      setEvents(data.events);
      setLastSyncedAt(new Date(data.syncedAt));
      setStatus("connected");
      setError(null);
    } catch {
      setStatus((current) => (current === "loading" ? "connected" : current));
      setError("sync_failed");
    }
  }, []);

  const loadCalendars = useCallback(async () => {
    const response = await fetch("/api/google/calendars", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as {
      calendars: CalendarSummary[];
      selectedCalendarIds: string[];
    };
    setCalendars(data.calendars);
    setSelectedIds(data.selectedCalendarIds);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const denied = params.get("calendar_error");
    if (denied) window.history.replaceState(null, "", window.location.pathname);

    const first = window.setTimeout(async () => {
      await sync();
      if (denied) setError("denied");
    }, 0);
    const interval = window.setInterval(sync, REFRESH_MS);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [sync]);

  useEffect(() => {
    if (status !== "connected") return;
    const timeout = window.setTimeout(loadCalendars, 0);
    return () => window.clearTimeout(timeout);
  }, [status, loadCalendars]);

  async function saveSelection(ids: string[]) {
    setSelectedIds(ids);
    const response = await fetch("/api/google/calendars", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ calendarIds: ids }),
    });
    if (response.ok) await sync();
    else setError("sync_failed");
  }

  async function disconnect() {
    await fetch("/api/google/disconnect", { method: "POST" });
    setEvents([]);
    setCalendars([]);
    setSelectedIds([]);
    setLastSyncedAt(null);
    setError(null);
    setStatus("disconnected");
  }

  return {
    status,
    error,
    events,
    lastSyncedAt,
    calendars,
    selectedIds,
    saveSelection,
    disconnect,
  };
}
