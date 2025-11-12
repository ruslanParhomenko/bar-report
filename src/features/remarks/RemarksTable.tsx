import { Table } from "@/components/ui/table";

import { RemarksTableHeader } from "./RemarksTableHeader";
import { RemarksTableBody } from "./RemarksTableBody";

export function RemarksTable() {
  return (
    <Table className="md:table-fixed">
      <RemarksTableHeader />
      <RemarksTableBody />
    </Table>
  );
}
