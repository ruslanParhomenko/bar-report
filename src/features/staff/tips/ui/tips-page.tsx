"use client";

import { useEmployees } from "@/providers/employees-provider";
import { useSearchParams } from "next/navigation";
import { GetTipsData } from "../model/type";
import TipsMonthPage from "./month/tips-month-page";
import TipsYearPage from "./year/tips-year-page";

export function TipsPage({
  dataTipsYear,
  isAdmin,
}: {
  dataTipsYear: GetTipsData[] | null;
  isAdmin: boolean;
}) {
  const tab = useSearchParams().get("tab");

  const employees = useEmployees();
  return (
    <>
      {tab === "tips-month" && (
        <TipsMonthPage
          dataTipsYear={dataTipsYear}
          employees={employees}
          isAdmin={isAdmin}
        />
      )}
      {tab === "tips-year" && <TipsYearPage dataTipsYear={dataTipsYear} />}
    </>
  );
}
