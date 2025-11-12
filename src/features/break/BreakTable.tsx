import { Table } from "@/components/ui/table";

import { BreakTableHeader } from "./BreakTableHeader";
import { BreakTableBody } from "./BreakTableBody";

export function BreakTable() {
  return (
    <Table className="md:table-fixed">
      <BreakTableHeader />
      <BreakTableBody />
    </Table>
  );
}
