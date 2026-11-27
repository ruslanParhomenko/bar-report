import { GetTipsAddYearEmployee } from "@/features/chart/chart-archive/chart-tips-add-employee/model/type";
import { MONTHS } from "@/utils/get-month-days";

export function getChartDataByEmployee(
  data: GetTipsAddYearEmployee[],
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

          result += +employee.resultAmount;
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
