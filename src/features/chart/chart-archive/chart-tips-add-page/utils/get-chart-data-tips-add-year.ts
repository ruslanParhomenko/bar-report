import { GetTipsAddYearEmployee } from "@/features/chart/chart-archive/chart-tips-add-employee/model/type";

export function getChartDataTipsFromYear(data: GetTipsAddYearEmployee[]) {
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

        entry.result += parseFloat(employee.resultAmount);

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
