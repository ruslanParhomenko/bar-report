"use client";

import { Employee } from "@/features/settings/create-employee/model/type";
import { useSearchParams } from "next/navigation";
import { GetTipsData } from "../model/type";
import TipsMonthPage from "./month/tips-month-page";
import TipsYearPage from "./year/tips-year-page";

export function TipsPage({
  dataTipsYear,
  employees,
}: {
  dataTipsYear: GetTipsData[] | null;
  employees: Employee[];
}) {
  const tab = useSearchParams().get("tab");
  return (
    <>
      {tab === "tips-month" && (
        <TipsMonthPage dataTipsYear={dataTipsYear} employees={employees} />
      )}
      {tab === "tips-year" && <TipsYearPage dataTipsYear={dataTipsYear} />}
    </>
  );
}
