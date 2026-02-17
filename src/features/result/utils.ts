import { MONTHS } from "@/utils/get-month-days";
import { TipsFormType } from "../tips/schema";

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
  dataTipsForMonth: any[],
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
      const tipRecord = dataTipsForMonth?.find((t) => t.employee === employee);

      const tip =
        tipRecord?.tipsByDay?.reduce(
          (total: number, day: string) => total + Number(day || 0),
          0,
        ) ?? 0;

      result.push({
        employee,
        rate,
        dayHours,
        nightHours,
        role,
        bonus: remark?.bonus ?? 0,
        penalty: remark?.penalty ?? 0,
        tips: tip ?? 0,
      });
    }
  }

  return result;
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

// result
export function useResultCalculations({
  data,
  dataTipsBid,
  month,
  year,
  role,
}: {
  data: ResultUniqueEmployeeType[];
  dataTipsBid: TipsFormType;
  month: string;
  year: string;
  role: string;
}) {
  const monthNumber = MONTHS.findIndex(
    (m) => m.toLowerCase() === month?.toLowerCase(),
  );
  const daysInMonth = new Date(Number(year), monthNumber + 1, 0).getDate();

  const percentTips = Number(dataTipsBid?.percentTips) || 0;
  const waitersDishBid = Number(dataTipsBid?.waitersDishBid) || 0;
  const barmenDishBid = Number(dataTipsBid?.barmenDishBid) || 0;
  const dishDishBid = Number(dataTipsBid?.dishDishBid) || 0;
  const percentBarmen = Number(dataTipsBid?.percentBarmen) || 0;
  const percentDish = Number(dataTipsBid?.percentDish) || 0;

  const roles = {
    waiters: data.filter((e) => e.role === "waiters"),
    barmen: data.filter((e) => e.role === "barmen"),
    dish: data.filter((e) => e.role === "dish"),
    cucina: data.filter((e) => e.role === "cook"),
  };
  const totalWaitersTips =
    dataTipsBid?.rowEmployeesTips
      ?.filter((w) => w.role === "waiters")
      .reduce((acc, w) => {
        const sumTipsByDay = w.tipsByDay
          .map((t) => Number(t) || 0)
          .reduce((sum, t) => sum + t, 0);
        return acc + sumTipsByDay;
      }, 0) || 0;

  const tipsForBarmen = totalWaitersTips * percentTips * percentBarmen;
  const tipsForDish = totalWaitersTips * percentTips * percentDish;

  const totalBarmenHours = roles.barmen.reduce(
    (acc, b) => acc + Number(b.dayHours || 0) + Number(b.nightHours || 0),
    0,
  );
  const totalDishHours = roles.dish.reduce(
    (acc, d) => acc + Number(d.dayHours || 0) + Number(d.nightHours || 0),
    0,
  );

  const maxHours = daysInMonth * 24;
  const constantHoursByMonth =
    maxHours > totalBarmenHours ? maxHours : totalBarmenHours;

  const coefficientDayNight =
    roles.barmen.reduce((acc, b) => acc + Number(b.dayHours || 0), 0) /
    (totalBarmenHours || 1);

  const coefficientBarmen = (tipsForBarmen ?? 0) / (constantHoursByMonth || 1);
  const coefficientDish = (tipsForDish ?? 0) / (totalDishHours || 1);

  const round5 = (v: number) => Math.round(v / 5) * 5;

  function getSendTips(
    e: ResultUniqueEmployeeType,
    tips: number,
    dayH: number,
    nightH: number,
  ) {
    if (e.role === "waiters") {
      return round5(tips - tips * waitersDishBid - tips * percentTips);
    }

    if (e.role === "barmen") {
      const tipsByWaiters =
        dayH * coefficientBarmen -
        dayH * coefficientBarmen * 0.1 +
        nightH * coefficientBarmen +
        nightH * coefficientBarmen * 0.1 * coefficientDayNight;

      return round5(
        tips + tipsByWaiters - (tips + tipsByWaiters) * barmenDishBid,
      );
    }

    if (e.role === "dish") {
      const tipsByWaiters = (dayH + nightH) * coefficientDish;
      return round5(
        tips + tipsByWaiters - (tips + tipsByWaiters) * dishDishBid,
      );
    }

    return tips; // cook
  }

  let totals = {
    sendTips: 0,
    penalty: 0,
    bonus: 0,
    dayH: 0,
    nightH: 0,
    totalHours: 0,
    salary: 0,
    result: 0,
  };

  const rows = data
    .filter((e) => e.role === (role === "cucina" ? "cook" : role))
    .sort((a, b) => a.employee.localeCompare(b.employee))
    .map((e) => {
      const { dayH, nightH, totalHours, rate, salary, tips } =
        calculateSalary(e);

      const sendTips = getSendTips(e, tips, dayH, nightH);

      const result =
        Number(salary) +
        Number(sendTips || 0) -
        Number(e.penalty) +
        Number(e.bonus);

      totals.sendTips += Number(sendTips || 0);
      totals.penalty += Number(e.penalty || 0);
      totals.bonus += Number(e.bonus || 0);
      totals.dayH += Number(dayH);
      totals.nightH += Number(nightH);
      totals.totalHours += Number(totalHours);
      totals.salary += Number(salary);
      totals.result += Number(result || 0);

      return {
        e,
        dayH,
        nightH,
        totalHours,
        rate,
        salary,
        tips,
        sendTips,
        result,
      };
    });

  return { rows, totals };
}
