import { SHIFTS_DAY, SHIFTS_NIGHT } from "@/features/archive/tips/constants";
import { TipsAddFormValues } from "@/features/bar/tips-add/schema";

type Amount = {
  time: string;
  typeAmount: string;
  value: string;
};

export function useTipsCalculation(
  employees: TipsAddFormValues[],
  currencyDay: number,
) {
  const calcEmployeeTotal = (amounts: Amount[]) => {
    return (amounts || []).reduce((sum, a) => {
      if (a.typeAmount === "mdl") return sum + Number(a.value);
      if (a.typeAmount === "chips") return sum + Number(a.value) * currencyDay;
      return sum;
    }, 0);
  };

  const waitersDay = employees.filter(
    (e) => e.role === "waiters" && SHIFTS_DAY.includes(e.shift),
  );

  const waitersNight = employees.filter(
    (e) => e.role === "waiters" && SHIFTS_NIGHT.includes(e.shift),
  );

  const barmen = employees.filter((e) => e.role === "barmen");

  const totalAmountWaitersDay = waitersDay.reduce(
    (acc, e) => acc + calcEmployeeTotal(e.amount),
    0,
  );

  const totalAmountWaitersNight = waitersNight.reduce(
    (acc, e) => acc + calcEmployeeTotal(e.amount),
    0,
  );

  const totalAmountBarmen = barmen.reduce(
    (acc, e) => acc + calcEmployeeTotal(e.amount),
    0,
  );

  const portionTipsDay =
    waitersDay.length > 0
      ? Number((totalAmountWaitersDay / 2 / waitersDay.length).toFixed(0))
      : 0;

  const portionTipsNight =
    waitersNight.length > 0
      ? Number((totalAmountWaitersNight / 2 / waitersNight.length).toFixed(0))
      : 0;

  const totalTips =
    totalAmountWaitersDay + totalAmountWaitersNight + totalAmountBarmen;

  const getEmployeeTotal = (emp: TipsAddFormValues) => {
    const personalTotal = calcEmployeeTotal(emp.amount);

    if (emp.role !== "waiters") return personalTotal;

    const portion =
      (SHIFTS_DAY.includes(emp.shift) && portionTipsDay) ||
      (SHIFTS_NIGHT.includes(emp.shift) && portionTipsNight) ||
      0;

    return personalTotal / 2 + portion;
  };

  return {
    totalTips,
    portionTipsDay,
    portionTipsNight,
    getEmployeeTotal,
    calcEmployeeTotal,
  };
}
