export function extractUniqueEmployees(
  schedules: any[],
  remarksByEmployee: any[],
  dataTipsForMonth: any[]
) {
  console.log("remarksByEmployee", dataTipsForMonth);
  const result = [];
  const seen = new Set<string>();

  for (const schedule of schedules) {
    if (!schedule?.rowShifts) continue;

    for (const shift of schedule.rowShifts) {
      const { employeeId, rate, dayHours, nightHours, role, employee } = shift;
      if (!employee || seen.has(employee)) continue;

      seen.add(employee);

      // Находим соответствие в remarksByEmployee
      const remark = remarksByEmployee?.find((r) => r.name === employee);

      // Находим соответствие в dataTipsForMonth
      const tip = dataTipsForMonth?.find((t) => t.employee === employee);

      result.push({
        employeeId,
        employee,
        rate,
        dayHours,
        nightHours,
        role,
        bonus: remark?.bonus ?? 0,
        penality: remark?.penality ?? 0,
        tips: tip?.tips ?? 0,
      });
    }
  }

  return result;
}

type RemarkItem = {
  name: string;
  dayHours: number;
  nightHours: number;
  penality: number;
  bonus: number;
};

export function getRemarksByMonth(
  remarksData: any,
  uniqueKey: string,
  MONTHS: string[]
): RemarkItem[] {
  if (!remarksData?.remarks) return [];

  return remarksData.remarks
    .filter((r: any) => {
      // безопасно приводим дату к строке
      const dateStr =
        r.date instanceof Date ? r.date.toISOString().split("T")[0] : r.date;

      if (!dateStr || typeof dateStr !== "string") return false; // <-- вместо continue

      const [year, month] = dateStr.split("-");
      const key = `${year}-${MONTHS[Number(month) - 1]}`;

      return key === uniqueKey;
    })
    .flatMap((r: any) =>
      r.remarks
        .filter((item: any) => item.name && item.name.trim() !== "")
        .map((item: any) => ({
          name: item.name.trim(),
          dayHours: Number(item.dayHours) || 0,
          nightHours: Number(item.nightHours) || 0,
          penality: Number(item.penality) || 0,
          bonus: Number(item.bonus) || 0,
        }))
    );
}
