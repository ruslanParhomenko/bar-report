"use client";
import { GetTipsData } from "@/app/actions/tips/tips-action";
import { useHashParam } from "@/hooks/use-hash";
import { useMonthDays } from "@/providers/month-days-provider";
import TipsMonthPage from "./month/tips-month-page";
import TipsYearPage from "./year/tips-year-page";

export default function TipsPage({
  dataTipsYear,
}: {
  dataTipsYear: GetTipsData[] | null;
}) {
  console.log("dataTipsYear", dataTipsYear);
  const [tab] = useHashParam("tab");

  const { month } = useMonthDays();

  const dataTips = dataTipsYear?.find((data) => data.id === month) || null;
  return (
    <>
      {tab === "tips-month" && <TipsMonthPage dataTips={dataTips} />}
      {tab === "tips-year" && <TipsYearPage dataTipsYear={dataTipsYear} />}
    </>
  );
}
