import { formatTime, type AgendaEvent } from "@/lib/home-page";

export function UpcomingAgenda({ events }: { events: AgendaEvent[] }) {
  return (
    <section aria-labelledby="agenda-heading">
      <div className="mb-4 flex min-h-13 items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-[11px] font-medium text-[#748780]">
            The rest of the day
          </p>
          <h2
            className="m-0 text-xl font-medium tracking-[-0.035em] text-[#183b3a]"
            id="agenda-heading"
          >
            Coming up
          </h2>
        </div>
        <span className="mb-0.5 text-[11px] text-[#87958f]">
          {events.length} events
        </span>
      </div>

      <ol className="m-0 list-none p-0">
        {events.map((event) => (
          <li
            className="grid min-h-18 grid-cols-[calc(var(--spacing)_*_17)_calc(var(--spacing)_*_3)_minmax(0,1fr)_auto] items-center gap-3 border-t border-[#dfe7e2] max-[430px]:grid-cols-[calc(var(--spacing)_*_15)_calc(var(--spacing)_*_2.5)_minmax(0,1fr)] max-[430px]:gap-2"
            key={event.title}
          >
            <time className="text-xs tabular-nums text-[#6e817a]">
              {formatTime(event.time)}
            </time>
            <span
              className="size-2 rounded-full border-2 border-[#93aa9f]"
              aria-hidden="true"
            />
            <div>
              <h3 className="m-0 text-[13px] font-semibold text-[#294943]">
                {event.title}
              </h3>
              <p className="mt-1 mb-0 text-[11px] text-[#83918b]">
                {event.detail}
              </p>
            </div>
            <span className="rounded bg-[#e8efea] px-2 py-1 text-[10px] text-[#668077] max-[430px]:hidden">
              {event.kind}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}