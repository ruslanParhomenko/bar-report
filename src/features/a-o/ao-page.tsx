"use client";
import { GetAoData } from "@/app/actions/a-o/ao-action";
import AoMonthPage from "./month/ao-month-page";
import AoYearPage from "./year/ao-year-page";

export default function AoPage({
  dataAoYear,
  tab,
}: {
  dataAoYear: GetAoData[] | null;
  tab: string;
}) {
  return (
    <>
      {tab === "ao-month" && <AoMonthPage dataAoYear={dataAoYear} />}

      {tab === "ao-year" && <AoYearPage dataAoYear={dataAoYear} />}
    </>
  );
}
