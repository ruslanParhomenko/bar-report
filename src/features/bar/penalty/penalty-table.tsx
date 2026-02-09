import { Table } from "@/components/ui/table";
import { PenaltyTableHeader } from "./penalty-header";
import { PenaltyTableBody } from "./penalty-body";

export default function PenaltyTable({
  data,
  isDisabled,
}: {
  data?: any;
  isDisabled: boolean;
}) {
  return (
    <Table className="md:table-fixed mt-6">
      <PenaltyTableHeader day={data?.day} />
      <PenaltyTableBody isDisabled={isDisabled} data={data} />
    </Table>
  );
}
