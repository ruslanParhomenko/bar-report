import { YearData } from "@/app/actions/remarks/remarks-action";
import { ChartDataItem } from "./chart-remarks-page";

export function getChartDataFromMonth(monthData: YearData): ChartDataItem[] {
  const map = new Map<string, ChartDataItem>();
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
        map.set(name, { name, reason: 0, bonus: 0, penalty: 0, hours: 0 });
      }
      const item = map.get(name)!;
      item.reason += 1;
      item.bonus += bonusVal;
      item.penalty += penaltyVal;
      item.hours += hours;
    }
  }
  return Array.from(map.values());
}

export function getChartDataFromYear(data: YearData[]): ChartDataItem[] {
  const map = new Map<string, ChartDataItem>();
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
          map.set(name, { name, reason: 0, bonus: 0, penalty: 0, hours: 0 });
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
