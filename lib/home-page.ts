import {
  Bike,
  BusFront,
  CarFront,
  TrainFront,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type TravelMode = "subway" | "bus" | "bike" | "drive";

export type TravelModeOption = {
  id: TravelMode;
  label: string;
  minutes: number;
  Icon: LucideIcon;
};

export type AgendaEvent = {
  time: Date;
  title: string;
  detail: string;
  kind: string;
};

export const travelModes: TravelModeOption[] = [
  { id: "subway", label: "Subway", minutes: 28, Icon: TrainFront },
  { id: "bus", label: "Bus", minutes: 36, Icon: BusFront },
  { id: "bike", label: "Bike", minutes: 24, Icon: Bike },
  { id: "drive", label: "Drive", minutes: 19, Icon: CarFront },
];

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatCountdown(milliseconds: number) {
  const totalMinutes = Math.ceil(milliseconds / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  return `${hours} hr ${minutes.toString().padStart(2, "0")} min`;
}