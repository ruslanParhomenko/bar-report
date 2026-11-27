"use client";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { remarksByUniqueEmployee } from "@/features/archive/penalty-archive/utils";
import {
  extractUniqueEmployees,
  useResultCalculations,
} from "@/features/result/lib/utils";
import ResultTableBody from "@/features/result/ui/result-body-table";
import ResultTableHeader from "@/features/result/ui/result-header-table";
import { GetScheduleData } from "@/features/schedule/schedule-edit/model/type";
import { GetTipsData } from "@/features/tips-month/model/type";

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
  tab,
}: {
  dataSchedules: GetScheduleData[] | null;
  dataRemarks: ReturnType<typeof remarksByUniqueEmployee>["formattedData"];
  tipsData: GetTipsData | null;
  month: string;
  year: string;
  isAdmin: boolean;
  tab: string;
}) {
  const role = tab;

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
    <div className="flex h-full flex-col items-center justify-center">
      <Card className="bg-gr/5 border-0 md:p-4">
        <Table className="table-auto">
          <ResultTableHeader month={month} />
          <ResultTableBody rows={rows} totals={totals} isAdmin={isAdmin} />
        </Table>
      </Card>
    </div>
  );
}
