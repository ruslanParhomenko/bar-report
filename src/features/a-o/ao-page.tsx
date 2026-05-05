"use client";
import { GetAoData } from "@/app/actions/a-o/ao-action";
import { useHashParam } from "@/hooks/use-hash";
import { useMonthDays } from "@/providers/month-days-provider";
import AoMonthPage from "./month/ao-month-page";
import AoYearPage from "./year/ao-year-page";

export default function AoPage({
  dataAoYear,
}: {
  dataAoYear: GetAoData[] | null;
}) {
  const [tab] = useHashParam("tab");
  const { month } = useMonthDays();

  const dataAo = dataAoYear?.find((ao) => ao.id === month) || null;

  return (
    <>
      {tab === "ao-month" && <AoMonthPage dataAo={dataAo} />}

      {tab === "ao-year" && <AoYearPage dataAoYear={dataAoYear} />}
    </>
  );
}
