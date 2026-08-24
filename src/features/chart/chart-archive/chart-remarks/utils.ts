import { GetRemarksYearData } from "@/features/penalty/model/type";
import { MONTHS } from "@/utils/get-month-days";

export function getChartDataFromYear(data: GetRemarksYearData[]) {
  const map = new Map<
    string,
    {
      name: string;
      reason: number;
      bonus: number;
      penalty: number;
      hours: number;
    }
  >();
  for (const monthData of data) {
    for (const day of monthData.remarks) {
      for (const entry of day.remarks) {
        const name = entry.name?.trim();
        if (!name) continue;
        const dayH = parseFloat(entry.dayHours) || 0;
        const nightH = parseFloat(entry.nightHours) || 0;
        const bonusVal = parseFloat(entry.bonus) || 0;
        const penaltyVal = parseFloat(entry.penalty) || 0;
        const hours = dayH + nightH;
        if (!map.has(name)) {
          map.set(name, {
            name: name.split(" ")[0],
            reason: 0,
            bonus: 0,
            penalty: 0,
            hours: 0,
          });
        }
        const item = map.get(name)!;
        item.reason += 1;
        item.bonus += bonusVal;
        item.penalty += penaltyVal;
        item.hours += hours;
      }
    }
  }
  return Array.from(map.values());
}

export function getChartDataPenaltyByEmployee(
  dataRemarks: GetRemarksYearData[],
  activeName: string | null,
) {
  if (!activeName) return [];

  return MONTHS.map((monthId) => {
    const monthData = dataRemarks.find((m) => m.id === monthId);

    let reason = 0;
    let bonus = 0;
    let penalty = 0;
    let hours = 0;

    (monthData?.remarks ?? []).forEach((day) => {
      day.remarks
        .filter((employee) => employee.name.trim() === activeName)
        .forEach((employee) => {
          reason += employee.reason ? 1 : 0;
          bonus += Number(employee.bonus) || 0;
          penalty += Number(employee.penalty) || 0;
          hours += Number(employee.dayHours) || 0;
        });
    });

    return {
      name: monthId,
      reason,
      bonus,
      penalty,
      hours,
    };
  });
}
