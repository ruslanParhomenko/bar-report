import { Table } from "@/components/ui/table";
import { PenaltyTableBody } from "./penalty-body";
import { PenaltyTableHeader } from "./penalty-header";

export default function PenaltyTable({
  day,
  isDisabled,
}: {
  day?: any;
  isDisabled: boolean;
}) {
  return (
    <Table className="my-4 table-fixed">
      <PenaltyTableHeader day={day} />
      <PenaltyTableBody isDisabled={isDisabled} />
    </Table>
  );
}
