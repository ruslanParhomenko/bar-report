import { GetTipsAddData } from "@/features/tips-add/model/type";

export function getChartDataTipsAddByDay(
  data: GetTipsAddData[],
  activeName: string | null,
) {
  if (!data) return [];
  const tipsAdd = data.sort((a, b) => parseInt(a.id) - parseInt(b.id));

  const chartData = tipsAdd.map((day) => {
    const currency = parseFloat(day.currency);
    let mdl = 0;
    let chips = 0;
    let result = 0;
    day.tipsAdd
      .filter(
        (employee) =>
          !activeName || employee.employeeName.trim() === activeName,
      )
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
