import { SHIFT_COLOR_MAP } from "@/features/schedule/schedule-edit/model/constants";

export function getInvalidConsecutiveShiftIndexes(shifts: string[]): {
  invalidIndex: Set<number>;
  invalidRest: Set<number>;
} {
  const invalidIndex = new Set<number>();
  const invalidRest = new Set<number>();

  let consecutive = 0;

  shifts.forEach((shift, index) => {
    const isWorkShift = !SHIFT_COLOR_MAP.includes(shift);

    if (!isWorkShift) {
      consecutive = 0;
      return;
    }

    consecutive += 1;

    if (consecutive > 3) {
      invalidIndex.add(index);
    }
  });

  shifts.forEach((shift, index) => {
    if (!shift) return;

    const parts = shift.split(".");
    const hasReturnShift = parts.some((part) => part === "20" || part === "18");

    if (hasReturnShift) {
      const nextShift = shifts[index + 1];
      const shiftAfterNext = shifts[index + 2];
      const shiftAfterNextSplit = shiftAfterNext?.split(".");

      if (nextShift === "") {
        if (
          shiftAfterNext !== undefined &&
          !shiftAfterNextSplit.includes("") &&
          !shiftAfterNextSplit.includes("20") &&
          !shiftAfterNextSplit.includes("18") &&
          !SHIFT_COLOR_MAP.includes(shiftAfterNext)
        ) {
          invalidRest.add(index + 1);
        }
      }
    }
  });

  return { invalidIndex, invalidRest };
}
