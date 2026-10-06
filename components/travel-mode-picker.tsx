import { cn } from "@/lib/utils";
import { travelModes, type TravelMode } from "@/lib/home-page";

type TravelModePickerProps = {
  selectedMode: TravelMode;
  onModeChange: (mode: TravelMode) => void;
};

export function TravelModePicker({
  selectedMode,
  onModeChange,
}: TravelModePickerProps) {
  return (
    <aside
      className="border-l border-[#dfe7e2] pt-px pl-7 max-[760px]:border-t max-[760px]:border-l-0 max-[760px]:pt-5.5"
      aria-labelledby="travel-heading"
    >
      <div className="mb-4 flex min-h-13 items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-[11px] font-medium text-[#748780]">
            Your commute
          </p>
          <h2
            className="m-0 max-w-56 text-lg font-medium tracking-[-0.035em] text-[#183b3a] max-[760px]:max-w-none"
            id="travel-heading"
          >
            How are you getting there?
          </h2>
        </div>
      </div>

      <div
        className="mt-4 grid gap-1 max-[760px]:grid-cols-2"
        role="group"
        aria-label="Travel mode"
      >
        {travelModes.map(({ id, label, minutes, Icon }) => (
          <button
            className={cn(
              "grid min-h-11 w-full grid-cols-[1.375rem_minmax(0,1fr)_auto] items-center gap-2.5 rounded-lg border px-2.5 text-left transition-colors motion-reduce:transition-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#8daea0]",
              selectedMode === id
                ? "border-[#d4e3d9] bg-[#e4eee8] text-[#285b55]"
                : "border-transparent bg-transparent text-[#667b73] hover:bg-[#e8efea]",
            )}
            type="button"
            key={id}
            aria-pressed={selectedMode === id}
            onClick={() => onModeChange(id)}
          >
            <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
            <span className="text-xs font-medium">{label}</span>
            <span
              className={cn(
                "text-[11px] tabular-nums",
                selectedMode === id ? "text-[#355f53]" : "text-[#73867d]",
              )}
            >
              {minutes}m
            </span>
          </button>
        ))}
      </div>

      <p className="mt-4 mb-0 ml-px text-[10px] leading-[1.5] text-[#84928b]">
        Estimates are examples. Your actual travel time may vary.
      </p>
    </aside>
  );
}