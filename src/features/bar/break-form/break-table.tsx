import { Table } from "@/components/ui/table";
import BreakTableHeader from "./break-header";
import BreakTableBody from "./break-body";
export default function BreakTable({
  employeesName,
  isDisabled,
}: {
  employeesName: string[];
  isDisabled: boolean;
}) {
  return (
    <Table>
      <BreakTableHeader />
      <BreakTableBody employeesName={employeesName} isDisabled={isDisabled} />
    </Table>
  );
}
