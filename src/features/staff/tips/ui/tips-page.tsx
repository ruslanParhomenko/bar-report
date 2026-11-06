"use client";

import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { Employee } from "@/features/settings/create-employee/model/type";
import TipsViewMonthPage from "@/features/staff/tips/ui/month/tips-view-month-page";
import { GetTipsAddData } from "@/features/tips-add/model/type";
import { useAccessCheck } from "@/hooks/use-tab-access";
import { useEdit } from "@/providers/edit-provider";
import { useSearchParams } from "next/navigation";
import { GetTipsData } from "../model/type";
import TipsEditMonthPage from "./month/tips-edit-month-page";
import TipsYearPage from "./year/tips-year-page";

export function TipsPage({
  employees,
  dataTipsYear,
  dataTipsAdd,
}: {
  employees: Employee[] | null;
  dataTipsYear: GetTipsData[] | null;
  dataTipsAdd: GetTipsAddData[] | null;
}) {
  const hasAccess = useAccessCheck();
  const tab = useSearchParams().get("tab");
  const { isEdit } = useEdit();

  if (!hasAccess) {
    return <InsufficientRights />;
  }

  if (tab === "tips-month") {
    if (isEdit) {
      return (
        <TipsEditMonthPage
          dataTipsYear={dataTipsYear}
          employees={employees}
          dataTipsAdd={dataTipsAdd}
        />
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
