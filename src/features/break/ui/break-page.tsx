import { Table } from "@/components/ui/table";
import BreakTableBody from "./break-body";
import BreakTableHeader from "./break-header";
export function BreakPage({
  employeesName,
}: {
  employeesName: { name: string; id: string }[];
}) {
  return (
    <Table className="my-4 md:table-fixed">
      <BreakTableHeader />
      <BreakTableBody employeesName={employeesName} />
    </Table>
  );
}
