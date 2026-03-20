import { SHIFT_HOURS_MAP_DAY, SHIFT_HOURS_MAP_NIGHT } from "./constants";

export function calculateShiftTotals(shifts: string[] | undefined) {
  const dayHours = (shifts || []).reduce(
    (sum, val) => sum + (SHIFT_HOURS_MAP_DAY[val] ?? 0),
    0,
  );
  const nightHours = (shifts || []).reduce(
    (sum, val) => sum + (SHIFT_HOURS_MAP_NIGHT[val] ?? 0),
    0,
  );
  const total = dayHours + nightHours;

  return { totalDay: dayHours, totalNight: nightHours, total };
}
