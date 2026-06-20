import { supabase } from "../config/supabase";

export type CycleInfo = {
  cycleDay: number;       // current day in cycle (1-based)
  daysUntilNext: number;  // days until next cycle starts
  nextDate: Date;         // predicted start date of next cycle
  isOnPeriod: boolean;    // whether currently in period days
};

const MS_DAY = 86400000;
const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };

export function getCycleInfo(
  lastPeriod?: string | null,
  cycleLength = 28,
  periodLength = 5
): CycleInfo | null {
  if (!lastPeriod) return null;

  const cl = cycleLength > 0 ? cycleLength : 28;
  const pl = periodLength > 0 ? periodLength : 5;

  const today = startOfDay(new Date());
  const start = startOfDay(new Date(lastPeriod));
  if (isNaN(start.getTime())) return null;

  const daysSince = Math.floor((today.getTime() - start.getTime()) / MS_DAY);
  if (daysSince < 0) {
    return { cycleDay: 0, daysUntilNext: -daysSince, nextDate: start, isOnPeriod: false };
  }

  const pos = daysSince % cl;          // 0-based position in cycle
  const cycleDay = pos + 1;            // 1-based
  const daysUntilNext = cl - pos;      // days until next cycle starts
  const nextDate = startOfDay(new Date(today.getTime() + daysUntilNext * MS_DAY));
  const isOnPeriod = cycleDay <= pl;

  return { cycleDay, daysUntilNext, nextDate, isOnPeriod };
}

export function isPeriodDay(
  date: Date,
  lastPeriod?: string | null,
  cycleLength = 28,
  periodLength = 5
): boolean {
  if (!lastPeriod) return false;
  const start = new Date(lastPeriod); start.setHours(0, 0, 0, 0);
  const day = new Date(date); day.setHours(0, 0, 0, 0);
  const diff = Math.floor((day.getTime() - start.getTime()) / 86400000);
  if (diff < 0) return false;
  return (((diff % cycleLength) + cycleLength) % cycleLength) < periodLength;
}

export async function savePeriodDate(dateStr: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not logged in" };
  const { error } = await supabase
    .from("profiles")
    .update({ last_period_date: dateStr })
    .eq("id", user.id);
  return { error };
}