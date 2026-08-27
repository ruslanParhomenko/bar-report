"use client";

import { Table } from "@/components/ui/table";
import { GetScheduleData } from "@/features/schedule/schedule-edit/model/type";
import { remarksByUniqueEmployee } from "@/features/staff/archive/penalty/utils";
import {
  extractUniqueEmployees,
  useResultCalculations,
} from "@/features/staff/result/lib/utils";
import ResultTableBody from "@/features/staff/result/ui/result-body-table";
import ResultTableHeader from "@/features/staff/result/ui/result-header-table";
import { GetTipsData } from "@/features/staff/tips/model/type";
import { useSearchParams } from "next/navigation";

const ROLE = {
  barmen: "bar",
  waiters: "bar",
  dish: "dish",
  cucina: "cucina",
};

export function ResultPage({
  dataSchedules,
  dataRemarks,
  tipsData,
  month,
  year,
  isAdmin,
}: {
  dataSchedules: GetScheduleData[] | null;
  dataRemarks: ReturnType<typeof remarksByUniqueEmployee>["formattedData"];
  tipsData: GetTipsData | null;
  month: string;
  year: string;
  isAdmin: boolean;
}) {
  const role = useSearchParams().get("tab") || "barmen";

  const selectedSchedule =
    dataSchedules?.filter(
      (item) => item.id === ROLE[role as keyof typeof ROLE],
    ) || [];

  const rowEmployees = tipsData?.tipsData?.rowEmployeesTips || [];
  const employees = extractUniqueEmployees(
    selectedSchedule,
    dataRemarks,
    rowEmployees,
  );

  const { rows, totals } = useResultCalculations({
    data: employees,
    dataTipsBid: tipsData?.tipsData!,
    month,
    year,
    role,
  });

  if (employees.length === 0)
    return (
      <div className="text-md text-rd flex h-[30vh] items-center justify-center font-bold">
        not data
      </div>
    );
  return (
    <Table className="table-fixed">
      <ResultTableHeader />
      <ResultTableBody rows={rows} totals={totals} isAdmin={isAdmin} />
    </Table>
  );
}
