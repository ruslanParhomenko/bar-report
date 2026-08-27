"use client";

import { Employee } from "@/features/settings/create-employee/model/type";
import TipsViewMonthPage from "@/features/staff/tips/ui/month/tips-view-month-page";
import { useEdit } from "@/providers/edit-provider";
import { useSearchParams } from "next/navigation";
import { GetTipsData } from "../model/type";
import TipsEditMonthPage from "./month/tips-edit-month-page";
import TipsYearPage from "./year/tips-year-page";

export function TipsPage({
  employees,
  dataTipsYear,
}: {
  employees: Employee[];
  dataTipsYear: GetTipsData[] | null;
}) {
  const tab = useSearchParams().get("tab");
  const { isEdit } = useEdit();

  if (tab === "tips-month") {
    if (isEdit) {
      return (
        <TipsEditMonthPage dataTipsYear={dataTipsYear} employees={employees} />
      );
    }
    if (!dataTipsYear) {
      return null;
    }
    return <TipsViewMonthPage dataTipsYear={dataTipsYear} />;
  }

  if (tab === "tips-year") {
    return <TipsYearPage dataTipsYear={dataTipsYear} />;
  }

  return null;
}
