import { SHIFT_COLOR_MAP } from "@/features/schedule/schedule-edit/model/constants";

export function getInvalidConsecutiveShiftIndexes(shifts: string[]): {
  invalidIndex: Set<number>;
  invalidRest: Set<number>;
  overRest: Set<number>;
} {
  const invalidIndex = new Set<number>();
  const invalidRest = new Set<number>();
  const overRest = new Set<number>();

  let consecutiveWork = 0;
  let consecutiveRest = 0;
  let restStartIndex = -1;

  shifts.forEach((shift, index) => {
    const isWorkShift = !SHIFT_COLOR_MAP.includes(shift);
    const isRestShift = shift === "" || shift === "/";

    if (isWorkShift) {
      if (consecutiveRest > 3) {
        for (let i = restStartIndex; i < index; i++) {
          overRest.add(i);
        }
      }
      consecutiveWork += 1;
      consecutiveRest = 0;
      restStartIndex = -1;

      if (consecutiveWork > 3) {
        invalidIndex.add(index);
      }
    } else if (isRestShift) {
      if (consecutiveRest === 0) {
        restStartIndex = index;
      }
      consecutiveRest += 1;
      consecutiveWork = 0;
    } else {
      if (consecutiveRest > 3) {
        for (let i = restStartIndex; i < index; i++) {
          overRest.add(i);
        }
      }
      consecutiveWork = 0;
      consecutiveRest = 0;
      restStartIndex = -1;
    }
  });

  // Проверка на конце массива
  if (consecutiveRest > 3) {
    for (let i = restStartIndex; i < shifts.length; i++) {
      overRest.add(i);
    }
  }

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

  return { invalidIndex, invalidRest, overRest };
}
