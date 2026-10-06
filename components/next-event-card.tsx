import { CalendarDays, Clock3, MapPin } from "lucide-react";
import {
  formatCountdown,
  formatTime,
  type TravelModeOption,
} from "@/lib/home-page";

type NextEventCardProps = {
  eventStartsAt: Date | null;
  leaveAt: Date | null;
  countdown: number | null;
  travelMode: TravelModeOption;
};

export function NextEventCard({
  eventStartsAt,
  leaveAt,
  countdown,
  travelMode,
}: NextEventCardProps) {
  const ModeIcon = travelMode.Icon;

  return (
    <section
      className="relative grid min-h-72 grid-cols-[minmax(0,1fr)_minmax(calc(var(--spacing)_*_52),0.72fr)] items-center gap-8 overflow-hidden rounded-2xl bg-[#1a4140] px-10.5 pt-8.5 pb-14 text-[#f4f7f2] max-[760px]:grid-cols-1 max-[760px]:gap-6 max-[760px]:px-6 max-[760px]:pt-7 max-[760px]:pb-16 max-[430px]:gap-4 max-[430px]:rounded-2xl max-[430px]:px-5 max-[430px]:pt-6"
      aria-labelledby="next-event-heading"
    >
      <span
        className="pointer-events-none absolute -right-28 -bottom-56 size-105 rounded-full border border-[#c2ddcc]/[0.12]"
        aria-hidden="true"
      />
      <div className="relative z-[1]">
        <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#b8d0c5]">
          <span
            className="size-2 shrink-0 rounded-full bg-[#f0ac76] ring-4 ring-[#f0ac76]/[0.13]"
            aria-hidden="true"
          />
          Next up
        </p>
        <h2
          className="m-0 text-[clamp(24px,3vw,31px)] font-medium leading-[1.15] tracking-[-0.045em] text-[#fbfcf8]"
          id="next-event-heading"
        >
          Coffee with Lena
        </h2>
        <p className="mt-2 flex items-center gap-2 text-[13px] text-[#c3d5cc]">
          <MapPin size={16} className="text-[#f1a27e]" aria-hidden="true" />
          Morrow Coffee, 82 Wythe Ave
        </p>

        <div className="mt-7 flex items-end gap-5 max-[430px]:mt-6 max-[430px]:flex-wrap max-[430px]:gap-3">
          <div>
            <span className="mb-0.5 block text-xs text-[#bdd1c7]">Leave by</span>
            <p
              className="m-0 text-[clamp(39px,5.2vw,52px)] font-medium leading-none tracking-[-0.065em] text-[#f8ca78] tabular-nums max-[430px]:text-[46px]"
              aria-live="polite"
            >
              {leaveAt ? formatTime(leaveAt) : "—"}
            </p>
          </div>
          <span className="mb-1 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[#d8e8de]/[0.17] bg-white/[0.06] px-3 py-2 text-[11px] font-medium text-[#d6e4db]">
            <Clock3 size={15} className="text-[#f3cb7a]" aria-hidden="true" />
            {countdown === null
              ? "Calculating"
              : countdown > 0
                ? `Leave in ${formatCountdown(countdown)}`
                : "Time to head out"}
          </span>
        </div>
      </div>

      <div
        className="relative z-[1] flex h-40 w-full max-w-xs justify-self-center flex-col items-start justify-between py-0.5 text-[#d9e8de] max-[760px]:h-26 max-[760px]:max-w-none max-[760px]:flex-row max-[760px]:items-center max-[760px]:py-0"
        aria-hidden="true"
      >
        <div className="flex items-center gap-3 text-xs max-[760px]:order-first">
          <span className="size-3 rounded-full border-2 border-[#f2c778]" />
          <span>Home</span>
        </div>
        <div className="absolute top-5 bottom-7 left-1 w-px border-l border-dashed border-[#cee2d6]/[0.52] max-[760px]:top-1/2 max-[760px]:right-[22%] max-[760px]:bottom-auto max-[760px]:left-[18%] max-[760px]:h-px max-[760px]:w-auto max-[760px]:border-t max-[760px]:border-l-0">
          <span className="absolute top-[36%] -left-4 grid size-9 place-items-center rounded-full border border-[#daebde]/[0.22] bg-[#24504a] text-[#f6cd80] max-[760px]:top-1/2 max-[760px]:left-1/2 max-[760px]:-translate-x-1/2 max-[760px]:-translate-y-1/2">
            <ModeIcon size={21} strokeWidth={1.8} />
          </span>
        </div>
        <div className="absolute top-[calc(36%_+_var(--spacing))] left-8.5 text-[11px] text-[#adc4b9] max-[760px]:top-[calc(50%_+_calc(var(--spacing)_*_6))] max-[760px]:left-1/2 max-[760px]:-translate-x-1/2">
          {travelMode.minutes} min
        </div>
        <div className="flex items-center gap-3 text-xs text-[#f1a27e] max-[760px]:order-last">
          <MapPin size={19} strokeWidth={1.8} />
          <span className="text-[#d9e8de]">Morrow Coffee</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-[#b8ccc1] max-[760px]:right-6 max-[760px]:bottom-6 max-[430px]:right-5 max-[430px]:bottom-5.5">
        <CalendarDays size={16} className="text-[#f0c674]" aria-hidden="true" />
        <span>
          Event at{" "}
          <strong className="font-semibold text-[#f3f6f1]">
            {eventStartsAt ? formatTime(eventStartsAt) : "—"}
          </strong>
        </span>
      </div>
    </section>
  );
}