import { SHIFT_COLOR_MAP } from "@/features/schedule/schedule-edit/model/constants";

export function getInvalidConsecutiveShiftIndexes(
  shifts: string[],
): Set<number> {
  const invalidIndexes = new Set<number>();

  let consecutive = 0;

  shifts.forEach((shift, index) => {
    const isWorkShift = ![...SHIFT_COLOR_MAP, "/"].includes(shift);

    if (!isWorkShift) {
      consecutive = 0;
      return;
    }

    consecutive += 1;

    if (consecutive > 3) {
      invalidIndexes.add(index);
    }
  });

  return invalidIndexes;
}
