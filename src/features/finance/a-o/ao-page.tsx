"use client";
import { GetAoData } from "@/app/actions/a-o/ao-action";
import { useSearchParams } from "next/navigation";
import AoMonthPage from "./month/ao-month-page";
import AoYearPage from "./year/ao-year-page";

export default function AoPage({
  dataAoYear,
}: {
  dataAoYear: GetAoData[] | null;
}) {
  const tab = useSearchParams().get("tab");
  return (
    <>
      {tab === "ao-month" && <AoMonthPage dataAoYear={dataAoYear} />}

      {tab === "ao-year" && <AoYearPage dataAoYear={dataAoYear} />}
    </>
  );
}
