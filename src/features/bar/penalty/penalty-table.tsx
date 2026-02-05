import { Table } from "@/components/ui/table";
import { PenaltyTableHeader } from "./penalty-header";
import { PenaltyTableBody } from "./penalty-body";

export default function PenaltyTable({ isDisabled }: { isDisabled: boolean }) {
  return (
    <Table className="md:table-fixed mt-6">
      <PenaltyTableHeader />
      <PenaltyTableBody isDisabled={isDisabled} />
    </Table>
  );
}
