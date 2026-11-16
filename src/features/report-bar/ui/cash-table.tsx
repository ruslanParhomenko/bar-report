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
import { BarForm } from "@/features/bar/model/schema";
import { formatNow } from "@/utils/format-date";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

export default function TableCashVerify() {
  const { control, setValue } = useFormContext<BarForm>();

  const fieldsValues = useWatch({
    name: "report.cashVerify",
    control,
  });

  const fieldsValuesBuffet = useWatch({
    name: "report.cashVerifyBuffet",
    control,
  });

  useEffect(() => {
    fieldsValues?.forEach((item, idx) => {
      if (item?.value && !item?.hours) {
        setValue(`report.cashVerify.${idx}.hours`, formatNow(), {
          shouldDirty: true,
        });
      }
    });
  }, [fieldsValues, setValue]);

  useEffect(() => {
    fieldsValuesBuffet?.forEach((item, idx) => {
      if (item?.value && !item?.hours) {
        setValue(`report.cashVerifyBuffet.${idx}.hours`, formatNow(), {
          shouldDirty: true,
        });
      }
    });
  }, [fieldsValuesBuffet, setValue]);

  return (
    <Table className="my-4 md:table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="text-bl font-bold">CashVerify</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="h-6 p-0 text-xs">
            <span className="flex h-full items-end justify-center pb-4">
              BAR
            </span>
          </TableCell>
          {fieldsValues.map((item, i) => {
            return (
              <TableCell key={i}>
                <span className="text-rd flex h-6 min-w-full items-center justify-center text-xs">
                  {item?.hours}
                </span>
                <NumericInput
                  fieldName={`report.cashVerify.${i}.value`}
                  className="h-8 text-center"
                />
              </TableCell>
            );
          })}
        </TableRow>
        <TableRow className="border-b!">
          <TableCell className="h-6 p-0 text-xs">
            <span className="flex h-full items-end justify-center pb-4">
              Buffet
            </span>
          </TableCell>
          {fieldsValuesBuffet?.map((item, i) => {
            return (
              <TableCell key={i}>
                <span className="text-rd flex h-6 min-w-full items-center justify-center text-xs">
                  {item?.hours}
                </span>
                <NumericInput
                  fieldName={`report.cashVerifyBuffet.${i}.value`}
                  className="h-8 text-center"
                />
              </TableCell>
            );
          })}
        </TableRow>
      </TableBody>
    </Table>
  );
}
