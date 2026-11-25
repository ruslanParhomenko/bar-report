"use client";
import NumericInput from "@/components/input-controlled/numeric-input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { BarForm } from "@/features/bar/model/schema";
import { formatNow } from "@/utils/format-date";
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

  return (
    <Table className="md:table-fixed">
      <TableBody className="[&>tr]:border-0">
        <TableRow className="p-0">
          <TableCell className="text-bl font-bold">CashVerify BAR</TableCell>
        </TableRow>
        <TableRow className="border-b! p-0">
          {fieldsValues.map((item, i) => {
            return (
              <TableCell key={i}>
                <NumericInput
                  fieldName={`report.cashVerify.${i}.value`}
                  className="h-8 text-center"
                  onValueChange={() => {
                    setValue(`report.cashVerify.${i}.hours`, formatNow(), {
                      shouldDirty: true,
                    });
                  }}
                />
                <span className="text-rd flex h-6 min-w-full items-center justify-center text-xs">
                  {item?.hours}
                </span>
              </TableCell>
            );
          })}
        </TableRow>
        <TableRow className="p-0">
          <TableCell className="text-bl font-bold">CashVerify BUFFET</TableCell>
        </TableRow>
        <TableRow className="border-b! p-0">
          {fieldsValuesBuffet?.map((item, i) => {
            return (
              <TableCell key={i}>
                <NumericInput
                  fieldName={`report.cashVerifyBuffet.${i}.value`}
                  className="h-8 text-center"
                  onValueChange={() => {
                    setValue(
                      `report.cashVerifyBuffet.${i}.hours`,
                      formatNow(),
                      {
                        shouldDirty: true,
                      },
                    );
                  }}
                />
                <span className="text-rd flex h-6 min-w-full items-center justify-center text-xs">
                  {item?.hours}
                </span>
              </TableCell>
            );
          })}
        </TableRow>
      </TableBody>
    </Table>
  );
}
