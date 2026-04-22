"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NumericInput from "@/components/input-controlled/numeric-input";
import { CashVerifySchemaType } from "./schema";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { formatNow } from "@/utils/format-date";

export default function TableCashVerify({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const { control, setValue } = useFormContext();

  const fieldsValues = useWatch({
    name: "report.cashVerify",
    control,
  }) as CashVerifySchemaType[];

  useEffect(() => {
    fieldsValues?.forEach((item, idx) => {
      if (item?.value && !item?.hours) {
        setValue(`report.cashVerify.${idx}.hours`, formatNow(), {
          shouldDirty: true,
        });
      }
    });
  }, [fieldsValues, setValue]);

  return (
    <Table className="md:table-fixed my-4">
      <TableHeader>
        <TableRow>
          <TableHead className="font-bold text-bl">CashVerify</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          {fieldsValues.map((item, i) => {
            return (
              <TableCell key={i}>
                <span className="text-xs flex justify-center items-center h-6 text-rd min-w-full">
                  {item?.hours}
                </span>
                <NumericInput
                  fieldName={`report.cashVerify.${i}.value`}
                  className="text-center h-8"
                  disabled={disabled}
                />
              </TableCell>
            );
          })}
        </TableRow>
      </TableBody>
    </Table>
  );
}
