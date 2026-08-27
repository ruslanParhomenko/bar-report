"use client";

import { useSearchParams } from "next/navigation";
import { GetAoData } from "../../a-o/model/type";
import { GetCashData } from "../model/type";
import CashMonthPage from "./month/cash-month-page";
import CashYearPage from "./year/cash-year-page";

export function CashPage({
  dataAo,
  dataCashYear,
}: {
  dataAo: GetAoData | null;
  dataCashYear: GetCashData[] | null;
}) {
  const tab = useSearchParams().get("tab");

  if (tab === "cash-month") {
    return <CashMonthPage dataAo={dataAo} dataCashYear={dataCashYear} />;
  }

  if (tab === "cash-year") {
    return <CashYearPage data={dataCashYear} />;
  }

  return null;
}
