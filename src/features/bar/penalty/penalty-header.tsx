import { TableCell, TableHeader, TableRow } from "@/components/ui/table";

export function PenaltyTableHeader({ day }: { day?: string }) {
  return (
    <TableHeader className="text-bl">
      <TableRow className="h-8">
        <TableCell className="w-8 py-1 px-2" />
        <TableCell className="w-38 py-1 px-2">{day || "-"}</TableCell>
        <TableCell className="text-center md:w-20 w-5 py-1 px-2">day</TableCell>
        <TableCell className="text-center md:w-20 w-5 py-1 px-2">
          night
        </TableCell>
        <TableCell className="text-center md:w-40 w-8 py-1 px-2">
          penalty
        </TableCell>
        <TableCell className="text-center md:w-40 w-8 py-1 px-2">
          bonus
        </TableCell>
        <TableCell className="md:w-100 w-8 py-1 px-2">reason</TableCell>
        <TableCell colSpan={2} className="md:w-30 w-5 py-1 px-2" />
      </TableRow>
    </TableHeader>
  );
}
