"use client";
import NumericInput from "@/components/input-controlled/numeric-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNow } from "@/utils/format-date";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CashVerifySchemaType } from "./schema";

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
    <Table className="my-4 md:table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="text-bl font-bold">CashVerify</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          {fieldsValues.map((item, i) => {
            return (
              <TableCell key={i}>
                <span className="text-rd flex h-6 min-w-full items-center justify-center text-xs">
                  {item?.hours}
                </span>
                <NumericInput
                  fieldName={`report.cashVerify.${i}.value`}
                  className="h-8 text-center"
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
