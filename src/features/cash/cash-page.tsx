"use client";
import { GetAoData } from "@/app/actions/a-o/ao-action";
import { GetCashData } from "@/app/actions/cash/cash-action";
import { useHashParam } from "@/hooks/use-hash";
import CashMonthPage from "./month/cash-month-page";
import CashYearPage from "./year/cash-year-page";

export default function CashPage({
  dataAo,
  dataCashYear,
}: {
  dataAo: GetAoData | null;
  dataCashYear: GetCashData[] | null;
}) {
  const [tab] = useHashParam("tab");

  return (
    <>
      {tab === "cash-month" && (
        <CashMonthPage dataAo={dataAo} dataCashYear={dataCashYear} />
      )}

      {tab === "cash-year" && <CashYearPage data={dataCashYear} />}
    </>
  );
}
