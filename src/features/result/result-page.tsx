"use client";
import { extractUniqueEmployees, useResultCalculations } from "./utils";
import ResultTableHeader from "./result-header-table";
import { Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import ResultTableBody from "./result-body-table";

import { remarksByUniqueEmployee } from "../archive/penalty-details/utils";
import { SchedulesContextValue } from "@/app/actions/schedule/schedule-action";
import { useHashParam } from "@/hooks/use-hash";
import { GetTipsData } from "@/app/actions/tips/tips-action";

const ROLE = {
  barmen: "bar",
  waiters: "bar",
  dish: "dish",
  cucina: "cucina",
};

export function PageResult({
  dataSchedule,
  dataRemarks,
  tipsData,
  month,
  year,
}: {
  dataSchedule: SchedulesContextValue[];
  dataRemarks: ReturnType<typeof remarksByUniqueEmployee>["formattedData"];
  tipsData: GetTipsData | null;
  month: string;
  year: string;
}) {
  const [tab] = useHashParam("tab");
  const role = tab ?? "barmen";

  const selectedSchedule = dataSchedule.filter(
    (item: any) => item.role === ROLE[role as keyof typeof ROLE],
  );

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
      <div className="flex justify-center h-[30vh] items-center text-md font-bold text-rd">
        not data
      </div>
    );
  return (
    <Table className={cn(employees.length === 0 && "hidden")}>
      <ResultTableHeader />
      <ResultTableBody rows={rows} totals={totals} />
    </Table>
  );
}
