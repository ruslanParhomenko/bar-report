"use client";
import { TTNGetDataType } from "@/app/actions/ttn/ttn-actions";
import { Activity } from "react";
import TTNForm from "./ttn-form";
import TTNDayPage from "./ttn-day-page";
import { CreateDataTTN } from "@/app/actions/data-constants/data-ttn-action";
import { useHashParam } from "@/hooks/use-hash";

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
        <TTNForm
          dataTtn={dataTtn}
          dataTtnPrev={dataTtnPrev}
          agentTTN={agentTTN.agent}
          month={month as string}
          year={year as string}
        />
      </Activity>
      <Activity mode={tab === "year" ? "visible" : "hidden"}>
        <div>Year</div>
      </Activity>
    </>
  );
}
