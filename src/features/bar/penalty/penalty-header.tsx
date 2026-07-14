import { TableCell, TableHeader, TableRow } from "@/components/ui/table";

export function PenaltyTableHeader({ day }: { day?: string }) {
  return (
    <TableHeader className="text-bl text-xs md:text-base">
      <TableRow>
        <TableCell className="w-4" />
        <TableCell className="w-20 md:w-38">{day || "-"}</TableCell>
        <TableCell className="w-10 text-center md:w-20">day</TableCell>
        <TableCell className="w-10 text-center md:w-20">night</TableCell>
        <TableCell className="w-10 text-center md:w-40">penalty</TableCell>
        <TableCell className="w-10 text-center md:w-40">bonus</TableCell>
        <TableCell className="w-18 md:w-100">reason</TableCell>
        <TableCell colSpan={2} className="w-10 md:w-30" />
      </TableRow>
    </TableHeader>
  );
}
