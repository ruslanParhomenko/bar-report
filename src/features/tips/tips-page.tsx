"use client";
import { GetTipsData } from "@/app/actions/tips/tips-action";
import { useSearchParams } from "next/navigation";
import TipsMonthPage from "./month/tips-month-page";
import TipsYearPage from "./year/tips-year-page";

export default function TipsPage({
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
