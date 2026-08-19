"use client";
import { Table } from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import { remarksByUniqueEmployee } from "../../archive/penalty/utils";
import { GetScheduleData } from "../../schedule/schedule-edit/model/type";
import { GetTipsData } from "../../tips/model/type";
import { extractUniqueEmployees, useResultCalculations } from "../lib/utils";
import ResultTableBody from "./result-body-table";
import ResultTableHeader from "./result-header-table";

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
