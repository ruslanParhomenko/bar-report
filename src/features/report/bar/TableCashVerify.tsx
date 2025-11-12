"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NumericInput from "@/components/inputs/NumericInput";
import { useAbility } from "@/providers/AbilityProvider";
import { HOURS } from "./schema";

export default function TableCashVerify() {
  const { isObserver, isUser } = useAbility();
  const isDisabled = isObserver || isUser;
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
                disabled={isDisabled}
              />
            </TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}
