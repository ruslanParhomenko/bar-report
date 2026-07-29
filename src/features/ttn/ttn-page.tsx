"use client";
import { CreateDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import { GetTTNData } from "@/app/actions/ttn/ttn-actions";
import { GetTtnNbmData } from "@/app/actions/ttn/ttn-nbm-action";
import { GetNbmProductsData } from "@/app/actions/ttn/ttn-nbm-products-action";
import { MONTHS } from "@/utils/get-month-days";
import { useSearchParams } from "next/navigation";
import TTNDayPage from "./moda-day/ttn-day-page";
import TtnMonthPage from "./moda-month/ttn-month-page";
import TtnYearPage from "./moda-year/ttn-year-page";
import TtnNbmMonthPage from "./nbm-month/ttn-nbm-page";
import NbmProductsPage from "./nbm-products/nbm-products-page";

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
  agentTTN: CreateDataTTN;
  dataProductsNbm: GetNbmProductsData[] | null;
  month: string;
  year: string;
}) {
  const tab = useSearchParams().get("tab");

  const indexOfCurrentMonth = MONTHS.findIndex((m) => m === month);
  const prevMonth = month === "january" ? "" : MONTHS[indexOfCurrentMonth - 1];

  const dataTtn = dataTTN?.find((data) => data.id === month) || null;
  const dataTtnPrev = dataTTN?.find((data) => data.id === prevMonth) || null;

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
          agentTTN={agentTTN.agent}
        />
      )}

      {tab === "moda-year" && (
        <TtnYearPage data={dataTTN} agentTTN={agentTTN.agent} />
      )}
      {tab === "nbm-month" && (
        <TtnNbmMonthPage
          dataTtnNBM={dataTtnNbm}
          agentTtnNbm={agentTTN.agentNbm}
        />
      )}
      {tab === "nbm-products" && <NbmProductsPage data={dataProductsNbm} />}
    </>
  );
}
