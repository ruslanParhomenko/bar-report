"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NumericInput from "@/components/inputs/numeric-input";
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

  const rows = 6;

  return (
    <Table className="md:table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-14 font-bold text-bl">CashVerify</TableHead>
          <TableHead className="w-12" />
          <TableHead className="w-14" />
          <TableHead className="w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => {
          const left = fieldsValues?.[i];
          const right = fieldsValues?.[i + rows];

          return (
            <TableRow key={i}>
              <TableCell className="py-1.5">
                <NumericInput
                  fieldName={`report.cashVerify.${i}.value`}
                  className="text-center h-6"
                  disabled={disabled}
                />
              </TableCell>

              <TableCell className="text-xs text-center py-0 text-rd">
                {left?.hours}
              </TableCell>

              <TableCell className="py-1">
                <NumericInput
                  fieldName={`report.cashVerify.${i + rows}.value`}
                  className=" text-center h-6"
                  disabled={disabled}
                />
              </TableCell>

              <TableCell className="text-xs text-center py-0 text-rd">
                {right?.hours}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
