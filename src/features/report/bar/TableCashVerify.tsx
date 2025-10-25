"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import NumericInput from "@/components/inputs/NumericInput";
import { useAbility } from "@/providers/AbilityProvider";
import { HOURS } from "./schema";

export default function TableCashVerify() {
  const { isObserver, isUser } = useAbility();
  const isDisabled = isObserver || isUser;
  return (
    <div className="w-full py-2">
      <Label className="text-lg font-semibold pb-4 text-bl">Cash Verify</Label>
      <Table className="[&_th]:text-center [&_td]:text-center">
        <TableHeader>
          <TableRow>
            {HOURS.map((hour) => (
              <TableHead key={hour}>{hour}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {HOURS.map((hour, idx) => (
              <TableCell key={hour}>
                <NumericInput
                  fieldName={`cashVerify.${idx}.value`}
                  className="w-14"
                  disabled={isDisabled}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
