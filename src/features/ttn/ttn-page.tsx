"use client";
import { CreateDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import { TTNGetDataType } from "@/app/actions/ttn/ttn-actions";
import { useHashParam } from "@/hooks/use-hash";
import { Activity } from "react";
import TTNDayPage from "./ttn-day";
import TtnMonth from "./ttn-month";

export default function TTNPage({
  dataTtn,
  dataTtnPrev,
  agentTTN,
  month,
  year,
}: {
  dataTtn: TTNGetDataType | null;
  dataTtnPrev: TTNGetDataType | null;
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
        <TtnMonth
          dataTtn={dataTtn}
          dataTtnPrev={dataTtnPrev}
          agentTTN={agentTTN.agent}
        />
      </Activity>
      <Activity mode={tab === "year" ? "visible" : "hidden"}>
        <div>Year</div>
      </Activity>
    </>
  );
}
