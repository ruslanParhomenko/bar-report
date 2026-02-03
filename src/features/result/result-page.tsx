import { extractUniqueEmployees, useResultCalculations } from "./utils";
import ResultTableHeader from "./result-header-table";
import { Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import ResultTableBody from "./result-body-table";
import { TipsFormType } from "../tips/schema";
import { remarksByUniqueEmployee } from "../penalty/utils";
import { SchedulesContextValue } from "@/app/actions/schedule/scheduleAction";
import { Card, CardContent } from "@/components/ui/card";

export function PageResult({
  dataSchedule,
  dataRemarks,
  dataTips,
  month,
  year,
  role,
}: {
  dataSchedule: SchedulesContextValue[];
  dataRemarks: ReturnType<typeof remarksByUniqueEmployee>["formattedData"];
  dataTips: TipsFormType;
  month: string;
  year: string;
  role: string;
}) {
  const employees = extractUniqueEmployees(
    dataSchedule,
    dataRemarks,
    dataTips?.rowEmployeesTips,
  );

  const { rows, totals } = useResultCalculations({
    data: employees,
    dataTipsBid: dataTips,
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
