import { extractUniqueEmployees, useResultCalculations } from "./utils";
import ResultTableHeader from "./ResultTableHeader";
import { Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import ResultTableBody from "./ResultTableBody";
import { TipsFormType } from "../tips/schema";
import { remarksByUniqueEmployee } from "../penalty/utils";
import { SchedulesContextValue } from "@/app/actions/schedule/scheduleAction";

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
  console.log("dataRemarks", dataRemarks);
  const employees = extractUniqueEmployees(
    dataSchedule,
    dataRemarks,
    dataTips?.rowEmployeesTips
  );

  const { rows, totals } = useResultCalculations({
    data: employees,
    dataTipsBid: dataTips,
    month,
    year,
    role,
  });

  return (
    <Table className={cn("", employees.length === 0 && "hidden")}>
      {/* <FilterDataByMonth disabled={isDisabled} /> */}
      <ResultTableHeader />
      <ResultTableBody rows={rows} totals={totals} />
    </Table>
  );
}
