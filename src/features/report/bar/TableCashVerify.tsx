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
import { CashVerifySchemaType } from "./schema";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { formatNow } from "@/utils/formatNow";

export default function TableCashVerify() {
  const form = useFormContext();
  const fieldsValues = form.watch("cashVerify") as CashVerifySchemaType[];
  useEffect(() => {
    fieldsValues?.forEach((item, idx) => {
      if (item?.value && !item?.hours) {
        form.setValue(`cashVerify.${idx}.hours`, formatNow(), {
          shouldDirty: true,
        });
      }
    });
  }, [fieldsValues, form]);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {fieldsValues.map((_hour, idx) => (
            <TableHead key={idx} className="text-center text-xs text-rd">
              {fieldsValues[idx].hours}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          {fieldsValues.map((_hour, idx) => (
            <TableCell key={idx}>
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
