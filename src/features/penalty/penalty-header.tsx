import DatePickerInput from "@/components/inputs/DatePickerInput";
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";

export function PenaltyTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableCell className="w-8"></TableCell>
        <TableCell className="w-38">
          <DatePickerInput
            fieldName="penalty.date"
            className="text-md text-rd"
            disabled
          />
        </TableCell>
        <TableCell className="text-center md:w-20 w-5">day</TableCell>
        <TableCell className="text-center md:w-20 w-5">night</TableCell>
        <TableCell className="text-center md:w-40 w-8">penalty</TableCell>
        <TableCell className="text-center md:w-40 w-8">bonus</TableCell>
        <TableCell className="md:w-100 w-8">reason</TableCell>
        <TableCell colSpan={2} className="md:w-30 w-5">
          actions
        </TableCell>
      </TableRow>
    </TableHeader>
  );
}
