import { Table } from "@/components/ui/table";
import BreakTableBody from "./break-body";
import BreakTableHeader from "./break-header";
export default function BreakTable({
  employeesName,
  isDisabled,
}: {
  employeesName: { name: string; id: string }[];
  isDisabled: boolean;
}) {
  return (
    <Table className="my-4 md:table-fixed">
      <BreakTableHeader />
      <BreakTableBody employeesName={employeesName} isDisabled={isDisabled} />
    </Table>
  );
}
