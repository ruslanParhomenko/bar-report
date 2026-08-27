"use client";

import { TtnEditMonthPage } from "@/features/finance/ttn/moda-month/ui/ttn-edit-month-page";
import { TtnViewMonthPage } from "@/features/finance/ttn/moda-month/ui/ttn-view-month-page";
import { DataOrderProducts, DataTTN } from "@/features/setting/model/type";
import { useEdit } from "@/providers/edit-provider";
import { MONTHS } from "@/utils/get-month-days";
import { useSearchParams } from "next/navigation";
import TTNDayPage from "./moda-day/ttn-day-page";
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
  orderProducts,
  month,
  year,
}: {
  dataTTN: GetTTNData[] | null;
  dataTtnNbm: GetTtnNbmData[] | null;
  agentTTN: DataTTN | null;
  dataProductsNbm: GetNbmProductsData[] | null;
  orderProducts: DataOrderProducts | null;
  month: string;
  year: string;
}) {
  const tab = useSearchParams().get("tab");
  const { isEdit } = useEdit();

  const indexOfCurrentMonth = MONTHS.findIndex((m) => m === month);
  const prevMonth = month === "january" ? "" : MONTHS[indexOfCurrentMonth - 1];

  const dataTtn = dataTTN?.find((d) => d.id === month) ?? null;
  const dataTtnPrev = dataTTN?.find((d) => d.id === prevMonth) ?? null;

  const agentModa = agentTTN?.agent ?? [];
  const agentNbm = agentTTN?.agentNbm ?? [];

  const TABS: Record<string, React.ReactNode> = {
    "moda-day": <TTNDayPage dataTtn={dataTtn} month={month} year={year} />,
    "moda-month": isEdit ? (
      <TtnEditMonthPage
        dataTtn={dataTtn}
        dataTtnPrev={dataTtnPrev}
        agentTTN={agentModa}
      />
    ) : (
      <TtnViewMonthPage dataTtn={dataTtn} />
    ),
    "moda-year": <TtnYearPage data={dataTTN} agentTTN={agentModa} />,
    "nbm-month": (
      <TtnNbmMonthPage dataTtnNBM={dataTtnNbm} agentTtnNbm={agentNbm} />
    ),
    "nbm-products": (
      <NbmProductsPage data={dataProductsNbm} orderProducts={orderProducts} />
    ),
    "nbm-products-year": <NbmProductsYearPage data={dataProductsNbm} />,
  };

  return <>{tab ? (TABS[tab] ?? null) : null}</>;
}
