import { Table } from "@/components/ui/table";
import { Employee } from "@/features/settings/create-employee/model/type";
import { PenaltyTableBody } from "./penalty-body";
import { PenaltyTableHeader } from "./penalty-header";

export function PenaltyPage({
  day,
  isDisabled,
  employees,
}: {
  day?: any;
  isDisabled: boolean;
  employees: Employee[];
}) {
  return (
    <Table className="table-fixed">
      <PenaltyTableHeader day={day} />
      <PenaltyTableBody isDisabled={isDisabled} employees={employees} />
    </Table>
  );
}
