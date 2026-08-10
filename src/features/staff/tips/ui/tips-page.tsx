"use client";

import { useSearchParams } from "next/navigation";
import { GetTipsData } from "../model/type";
import TipsMonthPage from "./month/tips-month-page";
import TipsYearPage from "./year/tips-year-page";

export function TipsPage({
  dataTipsYear,
}: {
  dataTipsYear: GetTipsData[] | null;
}) {
  const tab = useSearchParams().get("tab");
  return (
    <>
      {tab === "tips-month" && <TipsMonthPage dataTipsYear={dataTipsYear} />}
      {tab === "tips-year" && <TipsYearPage dataTipsYear={dataTipsYear} />}
    </>
  );
}
