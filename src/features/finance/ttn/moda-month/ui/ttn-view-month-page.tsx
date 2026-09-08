"use client";
import TtnViewBodyTable from "@/features/finance/ttn/moda-month/ui/ttn-view-body";
import TtnViewFooterTable from "@/features/finance/ttn/moda-month/ui/ttn-view-footer";
import { useMonthDays } from "@/hooks/use-month-days";
import { useState } from "react";
import { GetTTNData } from "../model/type";
import TtnHeaderTable from "./ttn-header";

export function TtnViewMonthPage({ dataTtn }: { dataTtn: GetTTNData | null }) {
  if (!dataTtn) return null;
  const { monthDays } = useMonthDays();

  const todayDay = new Date().getDate();
  const [selectedDay, setSelectedDay] = useState<number>(todayDay);

  const [itemSearch, setItemSearch] = useState<string>("");
  const normalizedSearch = itemSearch.trim().toLowerCase();

  return (
    <table className="max-w-[90dvw]">
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
      <TtnViewFooterTable
        rowSuppliers={dataTtn.ttnData.rowSuppliers}
        monthDays={monthDays}
      />
    </table>
  );
}
