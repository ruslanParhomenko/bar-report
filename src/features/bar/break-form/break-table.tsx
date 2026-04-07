import { Table } from "@/components/ui/table";
import BreakTableHeader from "./break-header";
import BreakTableBody from "./break-body";
export default function BreakTable({
  employeesName,
  isDisabled,
}: {
  employeesName: { name: string; id: string }[];
  isDisabled: boolean;
}) {
  return (
    <Table className="md:table-fixed my-4">
      <BreakTableHeader />
      <BreakTableBody employeesName={employeesName} isDisabled={isDisabled} />
    </Table>
  );
}
