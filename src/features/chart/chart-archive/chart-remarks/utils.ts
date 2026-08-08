import { YearData } from "@/app/actions/remarks/remarks-action";

export function getChartDataFromYear(data: YearData[]) {
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
