import type { AvailabilitySlot } from "@/types/availability";

const STORAGE_KEY = "skillbridge-tutor-recent-availability-slots";
const MAX_ENTRIES = 30;

export type RecentAvailabilitySlotRef = Pick<
  AvailabilitySlot,
  "id" | "date" | "startTime" | "endTime" | "status"
>;

function readAll(): RecentAvailabilitySlotRef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is RecentAvailabilitySlotRef =>
        typeof row === "object" &&
        row !== null &&
        typeof (row as RecentAvailabilitySlotRef).id === "string",
    );
  } catch {
    return [];
  }
}

function writeAll(rows: RecentAvailabilitySlotRef[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(rows.slice(0, MAX_ENTRIES)),
  );
}

export function getRecentAvailabilitySlots(): RecentAvailabilitySlotRef[] {
  return readAll();
}

export function rememberAvailabilitySlot(slot: AvailabilitySlot) {
  const row: RecentAvailabilitySlotRef = {
    id: slot.id,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: slot.status,
  };
  const rest = readAll().filter((r) => r.id !== row.id);
  writeAll([row, ...rest]);
}

export function forgetAvailabilitySlotId(slotId: string) {
  writeAll(readAll().filter((r) => r.id !== slotId));
}
