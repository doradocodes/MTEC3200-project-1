"use client";

import { useEffect, useState } from "react";
import { NextEventCard } from "@/components/next-event-card";
import { PageHeading } from "@/components/page-heading";
import { SampleScheduleNote } from "@/components/sample-schedule-note";
import { SiteHeader } from "@/components/site-header";
import { TravelModePicker } from "@/components/travel-mode-picker";
import { UpcomingAgenda } from "@/components/upcoming-agenda";
import { travelModes, type TravelMode } from "@/lib/home-page";

export function HomePage() {
  const [travelMode, setTravelMode] = useState<TravelMode>("subway");
  const [now, setNow] = useState<Date | null>(null);
  const [eventStartsAt, setEventStartsAt] = useState<Date | null>(null);

  useEffect(() => {
    const initialize = window.setTimeout(() => {
      const initialTime = new Date();
      setNow(initialTime);
      setEventStartsAt(new Date(initialTime.getTime() + 2 * 60 * 60 * 1000));
    }, 0);

    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => {
      window.clearTimeout(initialize);
      window.clearInterval(interval);
    };
  }, []);

  const selectedMode =
    travelModes.find((mode) => mode.id === travelMode) ?? travelModes[0];
  const leaveAt = eventStartsAt
    ? new Date(eventStartsAt.getTime() - selectedMode.minutes * 60_000)
    : null;
  const countdown =
    now && leaveAt ? leaveAt.getTime() - now.getTime() : null;
  const laterEvents = eventStartsAt
    ? [
        {
          time: new Date(eventStartsAt.getTime() + 1.75 * 60 * 60 * 1000),
          title: "Project critique",
          detail: "Studio 2B",
          kind: "In person",
        },
        {
          time: new Date(eventStartsAt.getTime() + 3.5 * 60 * 60 * 1000),
          title: "Dinner with friends",
          detail: "14 Orchard Street",
          kind: "In person",
        },
      ]
    : [];
  const dateLabel = now
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(now)
    : "Your schedule";

  return (
    <main className="mx-auto w-[calc(100%_-_calc(var(--spacing)*16))] max-w-6xl pb-8 max-[760px]:w-[calc(100%_-_calc(var(--spacing)*9))] max-[760px]:max-w-xl max-[760px]:pb-6 max-[430px]:w-[calc(100%_-_calc(var(--spacing)*7))]">
      <SiteHeader />
      <PageHeading dateLabel={dateLabel} />
      <NextEventCard
        eventStartsAt={eventStartsAt}
        leaveAt={leaveAt}
        countdown={countdown}
        travelMode={selectedMode}
      />

      <div className="mt-10 grid grid-cols-[minmax(0,1.35fr)_minmax(calc(var(--spacing)_*_70),0.75fr)] gap-14 max-[760px]:mt-8 max-[760px]:grid-cols-1 max-[760px]:gap-8">
        <UpcomingAgenda events={laterEvents} />
        <TravelModePicker
          selectedMode={travelMode}
          onModeChange={setTravelMode}
        />
      </div>

      <SampleScheduleNote />
    </main>
  );
}
