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

  return (
    <>
      {tab === "cash-month" && (
        <CashMonthPage dataAo={dataAo} dataCashYear={dataCashYear} />
      )}

      {tab === "cash-year" && <CashYearPage data={dataCashYear} />}
    </>
  );
}
