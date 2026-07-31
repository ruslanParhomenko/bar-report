import { GetAoData } from "@/app/actions/a-o/ao-action";
import { MONTHS } from "@/utils/get-month-days";

const sum = (values?: string[]) =>
  values?.reduce((acc, value) => acc + (Number(value) || 0), 0) ?? 0;

export function getAoChartData(dataAOYear: GetAoData[] | null) {
  return MONTHS.map((monthName) => {
    const monthData = dataAOYear?.find((item) => item.id === monthName);

    const row = monthData?.aoData?.rowAOData ?? {};

    const nori = sum(row.purchaseModaByDay) + sum(row.ttnModaByDay);

    const bar =
      sum(row.purchaseBarByDay) +
      sum(row.purchaseCookByDay) +
      sum(row.ttnBarByDay);

    const nbm = sum(row.advanceNBMByDay);

    const zn = sum(row.advanceZBN);

    return {
      name: monthName,
      nori: Math.round(nori),
      bar: Math.round(bar),
      nbm: Math.round(nbm),
      zn: Math.round(zn),
      moda: Math.round(nori + bar),
    };
  });
}
