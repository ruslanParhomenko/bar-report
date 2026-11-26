"use client";

import { Employee } from "@/features/settings/create-employee/model/type";
import { GetTipsAddData } from "@/features/tips-add/model/type";
import TipsViewMonthPage from "@/features/tips-month/ui/month/tips-view-month-page";
import { useEdit } from "@/providers/edit-provider";
import { GetTipsData } from "../model/type";
import TipsEditMonthPage from "./month/tips-edit-month-page";

interface TipsMonthProps {
  employees: Employee[] | null;
  dataTipsMonth: GetTipsData | null;
  dataTipsAddMonth: GetTipsAddData[] | null;
}

export default function TipsMonthPage({
  employees,
  dataTipsMonth,
  dataTipsAddMonth,
}: TipsMonthProps) {
  const { isEdit } = useEdit();

  if (isEdit) {
    return (
      <TipsEditMonthPage
        dataTipsMonth={dataTipsMonth}
        employees={employees}
        dataTipsAddMonth={dataTipsAddMonth}
      />
    );
  }

  return <TipsViewMonthPage dataTipsMonth={dataTipsMonth} />;
}
