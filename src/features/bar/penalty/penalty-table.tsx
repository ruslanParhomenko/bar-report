import { Table } from "@/components/ui/table";
import { PenaltyTableHeader } from "./penalty-header";
import { PenaltyTableBody } from "./penalty-body";

export default function PenaltyTable({
  day,
  isDisabled,
}: {
  day?: any;
  isDisabled: boolean;
}) {
  return (
    <Table className="md:table-fixed mt-6">
      <PenaltyTableHeader day={day} />
      <PenaltyTableBody isDisabled={isDisabled} />
    </Table>
  );
}
