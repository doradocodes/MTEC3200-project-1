"use client";

import { useEffect, useState } from "react";
import { NextEventCard } from "@/components/next-event-card";
import { PageHeading } from "@/components/page-heading";
import { CalendarConnection } from "@/components/calendar-connection";
import { SiteHeader } from "@/components/site-header";
import { SyncStatusBar } from "@/components/sync-status-bar";
import { TravelModePicker } from "@/components/travel-mode-picker";
import { UpcomingAgenda } from "@/components/upcoming-agenda";
import { travelModes, type AgendaEvent, type TravelMode } from "@/lib/home-page";
import { useGoogleCalendar } from "@/lib/use-google-calendar";

export function HomePage() {
  const [travelMode, setTravelMode] = useState<TravelMode>("subway");
  const calendar = useGoogleCalendar();
  const [now, setNow] = useState<Date | null>(null);
  const [sampleStart, setSampleStart] = useState<Date | null>(null);

  useEffect(() => {
    const initialize = window.setTimeout(() => {
      const initialTime = new Date();
      setNow(initialTime);
      setSampleStart(new Date(initialTime.getTime() + 2 * 60 * 60 * 1000));
    }, 0);

    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => {
      window.clearTimeout(initialize);
      window.clearInterval(interval);
    };
  }, []);

  const selectedMode =
    travelModes.find((mode) => mode.id === travelMode) ?? travelModes[0];
  const isSample = calendar.status === "disconnected";

  const upcoming = calendar.events.filter(
    (event) => !event.allDay && now && Date.parse(event.end) > now.getTime(),
  );
  const allDayEvents = calendar.events.filter((event) => event.allDay);
  const nextReal = upcoming[0];

  const eventStartsAt = isSample
    ? sampleStart
    : nextReal
      ? new Date(nextReal.start)
      : null;
  const leaveAt =
    isSample && eventStartsAt
      ? new Date(eventStartsAt.getTime() - selectedMode.minutes * 60_000)
      : null;
  const countdown =
    now && leaveAt ? leaveAt.getTime() - now.getTime() : null;

  const sampleEvents: AgendaEvent[] = sampleStart
    ? [
        {
          time: new Date(sampleStart.getTime() + 1.75 * 60 * 60 * 1000),
          title: "Project critique",
          detail: "Studio 2B",
          kind: "In person",
        },
        {
          time: new Date(sampleStart.getTime() + 3.5 * 60 * 60 * 1000),
          title: "Dinner with friends",
          detail: "14 Orchard Street",
          kind: "In person",
        },
      ]
    : [];
  const realEvents: AgendaEvent[] = [
    ...upcoming.slice(1).map((event) => ({
      time: new Date(event.start),
      title: event.title,
      detail: event.location ?? "No location",
      kind: event.location ? "In person" : "No location",
    })),
    ...allDayEvents.map((event) => ({
      time: new Date(event.start),
      title: event.title,
      detail: event.location ?? "All day",
      kind: "All day",
    })),
  ];
  const laterEvents = isSample ? sampleEvents : realEvents;
  const dateLabel = now
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(now)
    : "Your schedule";

  return (
    <main className="mx-auto w-[calc(100%_-_calc(var(--spacing)*16))] max-w-6xl pb-8 max-[760px]:w-[calc(100%_-_calc(var(--spacing)*9))] max-[760px]:max-w-xl max-[760px]:pb-6 max-[430px]:w-[calc(100%_-_calc(var(--spacing)*7))]">
      <SyncStatusBar
        status={calendar.status}
        error={calendar.error}
        lastSyncedAt={calendar.lastSyncedAt}
      />
      <SiteHeader isSample={isSample} />
      <PageHeading dateLabel={dateLabel} />
      {calendar.status !== "loading" && (isSample || nextReal) ? (
        <NextEventCard
          title={isSample ? "Coffee with Lena" : nextReal.title}
          location={isSample ? "Morrow Coffee, 82 Wythe Ave" : nextReal.location}
          eventStartsAt={eventStartsAt}
          commute={
            isSample
              ? { leaveAt, countdown, travelMode: selectedMode }
              : null
          }
        />
      ) : (
        <p className="rounded-2xl bg-white/55 px-6 py-10 text-sm text-[#657970]">
          {calendar.status === "loading"
            ? "Loading your calendar…"
            : "No more timed events today."}
        </p>
      )}

      <div className="mt-10 grid grid-cols-[minmax(0,1.35fr)_minmax(calc(var(--spacing)_*_70),0.75fr)] gap-14 max-[760px]:mt-8 max-[760px]:grid-cols-1 max-[760px]:gap-8">
        <UpcomingAgenda events={laterEvents} />
        <TravelModePicker
          selectedMode={travelMode}
          onModeChange={setTravelMode}
        />
      </div>

      <CalendarConnection
        status={calendar.status}
        calendars={calendar.calendars}
        selectedIds={calendar.selectedIds}
        onSelectionChange={calendar.saveSelection}
        onDisconnect={calendar.disconnect}
      />
    </main>
  );
}
