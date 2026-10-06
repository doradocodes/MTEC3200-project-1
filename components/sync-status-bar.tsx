import { AlertTriangle, CheckCircle2, Unplug } from "lucide-react";
import { formatTime } from "@/lib/home-page";
import type { CalendarStatus, SyncError } from "@/lib/use-google-calendar";

type SyncStatusBarProps = {
  status: CalendarStatus;
  error: SyncError;
  lastSyncedAt: Date | null;
};

const errorMessages = {
  auth_failed: "Google Calendar authorization failed. Reconnect to continue.",
  denied: "Google Calendar connection was not completed.",
  sync_failed: "Couldn't sync with Google Calendar. Events may be out of date.",
};

export function SyncStatusBar({ status, error, lastSyncedAt }: SyncStatusBarProps) {
  if (status === "loading") return null;

  const lastSync = lastSyncedAt ? `Last successful sync ${formatTime(lastSyncedAt)}.` : "No successful sync yet.";
  const failed = error !== null;
  const Icon = failed ? AlertTriangle : status === "connected" ? CheckCircle2 : Unplug;
  const tone = failed
    ? "bg-[#fbe9e0] text-[#8a3b1f]"
    : status === "connected"
      ? "bg-[#e5eee8] text-[#2d5a4c]"
      : "bg-[#f1f1ea] text-[#5c7068]";

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 text-xs font-medium ${tone}`}
      role={failed ? "alert" : "status"}
    >
      <Icon size={15} aria-hidden="true" />
      <span>
        {failed
          ? `${errorMessages[error]} ${status === "connected" ? lastSync : ""}`
          : status === "connected"
            ? `Google Calendar synced. ${lastSync}`
            : "Google Calendar is not connected."}
      </span>
    </div>
  );
}
