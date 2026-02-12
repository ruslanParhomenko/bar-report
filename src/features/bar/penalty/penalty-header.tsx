import { TableCell, TableHeader, TableRow } from "@/components/ui/table";

export function PenaltyTableHeader({ day }: { day?: string }) {
  return (
    <TableHeader>
      <TableRow className="text-bl">
        <TableCell className="w-8" />
        <TableCell className="w-38">{day || "-"}</TableCell>
        <TableCell className="text-center md:w-20 w-5">day</TableCell>
        <TableCell className="text-center md:w-20 w-5">night</TableCell>
        <TableCell className="text-center md:w-40 w-8">penalty</TableCell>
        <TableCell className="text-center md:w-40 w-8">bonus</TableCell>
        <TableCell className="md:w-100 w-8">reason</TableCell>
        <TableCell colSpan={2} className="md:w-30 w-5" />
      </TableRow>
    </TableHeader>
  );
}
