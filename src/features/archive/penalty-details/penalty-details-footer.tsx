import { RemarksDataByUniqueKey } from "@/app/actions/remarks/remarks-action";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";

export default function PenaltyDetailsFooter({
  data,
}: {
  data: RemarksDataByUniqueKey | null;
}) {
  const totalPenalty = data?.data.reduce((acc, r) => {
    const val = r.remarks.reduce(
      (acc: number, r: any) => acc + Number(r.penalty),
      0,
    );
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
  const totalBonus = data?.data.reduce((acc, r) => {
    const val = r.remarks.reduce(
      (acc: number, r: any) => acc + Number(r.bonus),
      0,
    );
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
  return (
    <TableFooter>
      <TableRow className="font-semibold sticky bottom-0 bg-background z-40">
        <TableCell className="text-right" colSpan={5}>
          total
        </TableCell>
        <TableCell className="text-center">{totalBonus}</TableCell>
        <TableCell className="text-center">{totalPenalty}</TableCell>
        <TableCell colSpan={2}></TableCell>
      </TableRow>
    </TableFooter>
  );
}
