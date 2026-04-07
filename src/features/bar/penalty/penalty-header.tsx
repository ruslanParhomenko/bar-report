import { TableCell, TableHeader, TableRow } from "@/components/ui/table";

export function PenaltyTableHeader({ day }: { day?: string }) {
  return (
    <TableHeader className="text-bl">
      <TableRow>
        <TableCell className="w-4" />
        <TableCell className="w-38">{day || "-"}</TableCell>
        <TableCell className="text-center md:w-20 w-12">day</TableCell>
        <TableCell className="text-center md:w-20 w-12">night</TableCell>
        <TableCell className="text-center md:w-40 w-20">penalty</TableCell>
        <TableCell className="text-center md:w-40 w-20">bonus</TableCell>
        <TableCell className="md:w-100 w-50">reason</TableCell>
        <TableCell colSpan={2} className="md:w-30 w-18" />
      </TableRow>
    </TableHeader>
  );
}
