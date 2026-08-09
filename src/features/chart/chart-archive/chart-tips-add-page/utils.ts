import { GetTipsAddByYear } from "@/features/staff/bar/tips-add/model/type";
import { MONTHS } from "@/utils/get-month-days";

export function getChartDataTipsFromYear(data: GetTipsAddByYear[]) {
  const employeeMap = new Map<
    string,
    {
      name: string;
      mdl: number;
      chips: number;
      total: number;
      result: number;
    }
  >();

  for (const monthData of data) {
    (monthData.tipsAdd ?? []).forEach((day) => {
      const currency = parseFloat(day.currency);

      day.tipsAdd.forEach((employee) => {
        const name = employee.employeeName.trim();

        if (!employeeMap.has(name)) {
          employeeMap.set(name, {
            name: name.split(" ")[0],
            mdl: 0,
            chips: 0,
            total: 0,
            result: 0,
          });
        }

        const entry = employeeMap.get(name)!;

        employee.amount.forEach((a) => {
          const val = parseFloat(a.value);
          if (a.typeAmount === "mdl") {
            entry.mdl += val;
          } else if (a.typeAmount === "chips") {
            entry.chips += val * currency;
          }
        });

        employee.resultAmount.forEach((r) => {
          entry.result += r.value;
        });

        entry.total = entry.mdl + entry.chips;
      });
    });
  }

  return Array.from(employeeMap.values()).map((e) => ({
    name: e.name,
    mdl: parseFloat(e.mdl.toFixed(0)),
    chips: parseFloat(e.chips.toFixed(0)),
    total: parseFloat(e.total.toFixed(0)),
    result: parseFloat(e.result.toFixed(0)),
  }));
}

export function getChartDataTipsByDay(data: GetTipsAddByYear | null) {
  if (!data) return [];
  const tipsAdd = data.tipsAdd.sort((a, b) => parseInt(a.id) - parseInt(b.id));

  const chartData = tipsAdd.map((day) => {
    const currency = parseFloat(day.currency);
    let mdl = 0;
    let chips = 0;
    let result = 0;
    day.tipsAdd.forEach((employee) => {
      employee.amount.forEach((a) => {
        const val = parseFloat(a.value);
        if (a.typeAmount === "mdl") {
          mdl += val;
        } else if (a.typeAmount === "chips") {
          chips += val * currency;
        }
      });
      employee.resultAmount.forEach((r) => {
        result += r.value;
      });
    });

    const tipsTotal = mdl + chips;
    return {
      name: day.id,
      mdl: parseFloat(mdl.toFixed(0)),
      chips: parseFloat(chips.toFixed(0)),
      total: parseFloat(tipsTotal.toFixed(0)),
      result: parseFloat(result.toFixed(0)),
    };
  });

  return chartData;
}

export function getChartDataByEmployee(
  data: GetTipsAddByYear[],
  activeName: string | null,
) {
  if (!activeName) return [];
  const chartData = MONTHS.map((monthId) => {
    const monthData = data?.find((m) => m.id === monthId);

    let mdl = 0;
    let chips = 0;
    let result = 0;

    (monthData?.tipsAdd ?? []).forEach((day) => {
      const currency = parseFloat(day.currency);

      day.tipsAdd
        .filter((employee) => employee.employeeName.trim() === activeName)
        .forEach((employee) => {
          employee.amount.forEach((a) => {
            const val = parseFloat(a.value);
            if (a.typeAmount === "mdl") {
              mdl += val;
            } else if (a.typeAmount === "chips") {
              chips += val * currency;
            }
          });
          employee.resultAmount.forEach((r) => {
            result += r.value;
          });
        });
    });

    const tipsTotal = mdl + chips;

    return {
      name: monthId,
      mdl: parseFloat(mdl.toFixed(0)),
      chips: parseFloat(chips.toFixed(0)),
      total: parseFloat(tipsTotal.toFixed(0)),
      result: parseFloat(result.toFixed(0)),
    };
  });
  return chartData;
}
