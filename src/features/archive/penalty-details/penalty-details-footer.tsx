import { GetRemarksData } from "@/app/actions/remarks/remarks-action";
import { TableCell, TableFooter, TableRow } from "@/components/ui/table";

export default function PenaltyDetailsFooter({
  data,
}: {
  data: GetRemarksData[] | null;
}) {
  const totalPenalty = data?.reduce((acc, r) => {
    const val = r.remarks.reduce(
      (acc: number, r: any) => acc + Number(r.penalty),
      0,
    );
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
  const totalBonus = data?.reduce((acc, r) => {
    const val = r.remarks.reduce(
      (acc: number, r: any) => acc + Number(r.bonus),
      0,
    );
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
  return (
    <TableFooter className="bg-background sticky bottom-0 z-40">
      <TableRow className="[&>td]:text-rd [&>td]:h-7! [&>td]:text-xs [&>th]:py-0!">
        <TableCell className="text-right" colSpan={5}>
          total
        </TableCell>
        <TableCell className="text-center">{totalBonus}</TableCell>
        <TableCell className="text-center">{totalPenalty}</TableCell>
      </TableRow>
    </TableFooter>
  );
}
