"use client";
import { CreateDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import { GetTTNData } from "@/app/actions/ttn/ttn-actions";
import { useHashParam } from "@/hooks/use-hash";
import { Activity } from "react";
import TTNDayPage from "./day/ttn-day-page";
import TtnMonthPage from "./month/ttn-month-page";
import TtnYearPage from "./year/ttn-year-page";

export default function TTNPage({
  dataTTN,
  dataTtn,
  dataTtnPrev,
  agentTTN,
  month,
  year,
}: {
  dataTTN: GetTTNData[] | null;
  dataTtn: GetTTNData | null;
  dataTtnPrev: GetTTNData | null;
  agentTTN: CreateDataTTN;
  month: string;
  year: string;
}) {
  const [tab] = useHashParam("tab");

  return (
    <>
      <Activity mode={tab === "day" ? "visible" : "hidden"}>
        <TTNDayPage
          dataTtn={dataTtn}
          month={month as string}
          year={year as string}
        />
      </Activity>

      <Activity mode={tab === "month" ? "visible" : "hidden"}>
        <TtnMonthPage
          dataTtn={dataTtn}
          dataTtnPrev={dataTtnPrev}
          agentTTN={agentTTN.agent}
        />
      </Activity>
      <Activity mode={tab === "year" ? "visible" : "hidden"}>
        <TtnYearPage data={dataTTN} agentTTN={agentTTN.agent} />
      </Activity>
    </>
  );
}
