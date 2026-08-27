"use client";

import { useState } from "react";

import TtnViewBodyTable from "@/features/finance/ttn/moda-month/ui/ttn-view-body";
import { useMonthDays } from "@/hooks/use-month-days";
import { GetTTNData } from "../model/type";
import TtnHeaderTable from "./ttn-header";

export function TtnViewMonthPage({ dataTtn }: { dataTtn: GetTTNData | null }) {
  if (!dataTtn) return null;
  const { monthDays, month, year } = useMonthDays();

  console.log(dataTtn);

  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);

  const [itemSearch, setItemSearch] = useState<string>("");
  const normalizedSearch = itemSearch.trim().toLowerCase();

  return (
    <table>
      <TtnHeaderTable
        setItemSearch={setItemSearch}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />
      <TtnViewBodyTable
        data={dataTtn.ttnData}
        normalizedSearch={normalizedSearch}
        setSelectedDay={setSelectedDay}
      />
      {/* <TTNFooterTable arrayRows={[...agentTTN]} monthDays={monthDays} /> */}
    </table>
  );
}
