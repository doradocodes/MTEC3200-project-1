import type { CalendarSummary } from "@/lib/google-calendar";
import type { CalendarStatus } from "@/lib/use-google-calendar";

type CalendarConnectionProps = {
  status: CalendarStatus;
  calendars: CalendarSummary[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onDisconnect: () => void;
};

export function CalendarConnection({
  status,
  calendars,
  selectedIds,
  onSelectionChange,
  onDisconnect,
}: CalendarConnectionProps) {
  if (status === "loading") return null;

  function toggle(id: string) {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((selected) => selected !== id)
      : [...selectedIds, id];
    if (next.length > 0) onSelectionChange(next);
  }

  return (
    <section className="mt-9 rounded-lg border border-[#e0e8e2] bg-white/55 px-4 py-3.5">
      {status === "disconnected" ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="m-0 text-[11px] text-[#657970]">
            You’re viewing a sample day. Connect Google Calendar (read-only) to see your own plans.
          </p>
          {/* Full navigation is required to start the OAuth redirect */}
          <a
            className="rounded-md bg-[#183b3a] px-3 py-2 text-xs font-medium text-white no-underline"
            href="/api/google/login"
          >
            Connect Google Calendar
          </a>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between gap-3">
            <h2 className="m-0 text-xs font-semibold text-[#294943]">Calendars to read</h2>
            <button
              className="text-[11px] text-[#657970] underline"
              type="button"
              onClick={onDisconnect}
            >
              Disconnect
            </button>
          </div>
          <ul className="m-0 mt-2 list-none p-0">
            {calendars.map((calendar) => (
              <li key={calendar.id}>
                <label className="flex items-center gap-2 py-1 text-xs text-[#4b625a]">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(calendar.id)}
                    onChange={() => toggle(calendar.id)}
                  />
                  {calendar.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
