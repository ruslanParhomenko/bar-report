"use client";
import { useSearchParams } from "next/navigation";
import { GetAoData } from "../model/type";
import AoMonthPage from "./month/ao-month-page";
import AoYearPage from "./year/ao-year-page";

export function AoPage({ dataAoYear }: { dataAoYear: GetAoData[] | null }) {
  const tab = useSearchParams().get("tab");
  return (
    <>
      {tab === "ao-month" && <AoMonthPage dataAoYear={dataAoYear} />}

      {tab === "ao-year" && <AoYearPage dataAoYear={dataAoYear} />}
    </>
  );
}
