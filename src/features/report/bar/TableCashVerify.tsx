import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NumericInput from "@/components/inputs/NumericInput";
import { HOURS } from "./schema";

export default function TableCashVerify() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {HOURS.map((hour) => (
            <TableHead key={hour} className="text-center">
              {hour}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          {HOURS.map((hour, idx) => (
            <TableCell key={hour}>
              <NumericInput
                fieldName={`cashVerify.${idx}.value`}
                className="w-12 p-0"
              />
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}
