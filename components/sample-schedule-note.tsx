import { CalendarDays } from "lucide-react";

export function SampleScheduleNote() {
  return (
    <footer className="mt-9 flex items-center gap-2.5 rounded-lg border border-[#e0e8e2] bg-white/55 px-4 py-3.5">
      <span
        className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#e5eee8] text-[#5e8576]"
        aria-hidden="true"
      >
        <CalendarDays size={16} />
      </span>
      <p className="m-0 text-[11px] leading-[1.45] text-[#657970]">
        You’re viewing a sample day. Connect a calendar to see your own plans.
      </p>
    </footer>
  );
}