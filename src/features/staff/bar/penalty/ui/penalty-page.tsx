import { Table } from "@/components/ui/table";
import { Employee } from "@/features/settings/create-employee/model/type";
import { PenaltyTableBody } from "./penalty-body";
import { PenaltyTableHeader } from "./penalty-header";

export function PenaltyPage({
  day,
  employees,
}: {
  day?: any;
  employees: Employee[];
}) {
  return (
    <Table className="table-fixed">
      <PenaltyTableHeader day={day} />
      <PenaltyTableBody employees={employees} />
    </Table>
  );
}
