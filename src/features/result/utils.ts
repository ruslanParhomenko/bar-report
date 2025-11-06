export type ResultUniqueEmployeeType = {
  employee: string;
  rate: string;
  dayHours: string;
  nightHours: string;
  role: string;
  bonus: number;
  penalty: number;
  tips: number;
};

export function extractUniqueEmployees(
  schedules: any[],
  remarksByEmployee: any[],
  dataTipsForMonth: any[]
): ResultUniqueEmployeeType[] {
  const result = [];
  const seen = new Set<string>();

  for (const schedule of schedules) {
    if (!schedule?.rowShifts) continue;

    for (const shift of schedule.rowShifts) {
      const { rate, dayHours, nightHours, role, employee } = shift;
      if (!employee || seen.has(employee)) continue;

      seen.add(employee);

      const remark = remarksByEmployee?.find((r) => r.name === employee);

      const tip = dataTipsForMonth?.find((t) => t.employee === employee);

      result.push({
        employee,
        rate,
        dayHours,
        nightHours,
        role,
        bonus: remark?.bonus ?? 0,
        penalty: remark?.penality ?? 0,
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

// salary

export function calculateSalary(data: ResultUniqueEmployeeType) {
  const dayH = Number(data.dayHours ?? 0);
  const nightH = Number(data.nightHours ?? 0);
  const totalHours = dayH + nightH;
  const rate = Number(data.rate ?? 0);
  const tips = Number(data.tips ?? 0);

  const salary = (
    (rate / 186) * 0.9 * dayH +
    (rate / 186) * 1.15 * nightH
  ).toFixed(0);
  return {
    dayH,
    nightH,
    totalHours,
    rate,
    salary,
    tips,
  };
}
