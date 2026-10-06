import { ArrowDownRight } from "lucide-react";
import Link from "next/link";

export function SiteHeader({ isSample }: { isSample: boolean }) {
  return (
    <header className="flex min-h-20 items-center justify-between border-b border-[#dfe7e2] max-[760px]:min-h-17">
      <Link
        className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-[-0.04em] text-[#183b3a] no-underline max-[430px]:text-sm"
        href="/"
        aria-label="Out the Door home"
      >
        <span
          className="grid size-8 place-items-center rounded-lg rounded-bl-sm bg-[#183b3a] text-[#f7f8f4]"
          aria-hidden="true"
        >
          <ArrowDownRight size={19} strokeWidth={2.3} />
        </span>
        <span>out the door</span>
      </Link>

      {isSample && (
      <div
        className="inline-flex items-center gap-2 rounded-full border border-[#d9e3dc] bg-white/55 px-3 py-2 text-xs font-medium text-[#5c7068] max-[430px]:px-2 max-[430px]:py-1.5 max-[430px]:text-[10px]"
        aria-label="Sample schedule preview"
      >
        <span
          className="size-2 shrink-0 rounded-full bg-[#dfa94d]"
          aria-hidden="true"
        />
        Sample schedule
      </div>
      )}
    </header>
  );
}