"use client";

import { DataTTN } from "@/features/settings/setting/model/type";
import { MONTHS } from "@/utils/get-month-days";
import { useSearchParams } from "next/navigation";
import TTNDayPage from "./moda-day/ttn-day-page";
import { TtnMonthPage } from "./moda-month";
import { GetTTNData } from "./moda-month/model/type";
import { TtnYearPage } from "./moda-year";
import { TtnNbmMonthPage } from "./nbm-month";
import { GetTtnNbmData } from "./nbm-month/model/type";
import NbmProductsYearPage from "./nbm-products-year/nbm-products-year-page";
import { GetNbmProductsData } from "./nbm-products/model/type";
import NbmProductsPage from "./nbm-products/ui/nbm-products-page";

export default function TTNPage({
  dataTTN,
  dataTtnNbm,
  agentTTN,
  dataProductsNbm,
  month,
  year,
}: {
  dataTTN: GetTTNData[] | null;
  dataTtnNbm: GetTtnNbmData[] | null;
  agentTTN: DataTTN | null;
  dataProductsNbm: GetNbmProductsData[] | null;
  month: string;
  year: string;
}) {
  const tab = useSearchParams().get("tab");

  const indexOfCurrentMonth = MONTHS.findIndex((m) => m === month);
  const prevMonth = month === "january" ? "" : MONTHS[indexOfCurrentMonth - 1];

  const dataTtn = dataTTN?.find((data) => data.id === month) || null;
  const dataTtnPrev = dataTTN?.find((data) => data.id === prevMonth) || null;

  const agentModa = agentTTN?.agent || [];
  const agentNbm = agentTTN?.agentNbm || [];

  return (
    <>
      {tab === "moda-day" && (
        <TTNDayPage
          dataTtn={dataTtn}
          month={month as string}
          year={year as string}
        />
      )}

      {tab === "moda-month" && (
        <TtnMonthPage
          dataTtn={dataTtn}
          dataTtnPrev={dataTtnPrev}
          agentTTN={agentModa}
        />
      )}

      {tab === "moda-year" && (
        <TtnYearPage data={dataTTN} agentTTN={agentModa} />
      )}
      {tab === "nbm-month" && (
        <TtnNbmMonthPage dataTtnNBM={dataTtnNbm} agentTtnNbm={agentNbm} />
      )}
      {tab === "nbm-products" && <NbmProductsPage data={dataProductsNbm} />}
      {tab === "nbm-products-year" && (
        <NbmProductsYearPage data={dataProductsNbm} />
      )}
    </>
  );
}
