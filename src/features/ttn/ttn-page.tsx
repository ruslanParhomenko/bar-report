"use client";
import { TTNGetDataType } from "@/app/actions/ttn/ttn-actions";
import { useSearchParams } from "next/navigation";
import { Activity } from "react";
import TTNForm from "./ttn-form";
import TTNDayPage from "./ttn-day-page";

export default function TTNPage({
  dataTtn,
  dataTtnPrev,
  dataTtnByDay,
  month,
  year,
}: {
  dataTtn: TTNGetDataType | null;
  dataTtnPrev: TTNGetDataType | null;
  dataTtnByDay: any;
  month: string;
  year: string;
}) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") as string;
  return (
    <>
      <Activity mode={tab === "day" ? "visible" : "hidden"}>
        <TTNDayPage
          dataTtn={dataTtnByDay}
          month={month as string}
          year={year as string}
        />
      </Activity>

      <Activity mode={tab === "month" ? "visible" : "hidden"}>
        <TTNForm
          dataTtn={dataTtn}
          dataTtnPrev={dataTtnPrev}
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
