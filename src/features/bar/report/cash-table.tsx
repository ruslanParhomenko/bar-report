"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import NumericInput from "@/components/inputs/NumericInput";
import { CashVerifySchemaType } from "./schema";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { formatNow } from "@/utils/formatNow";

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
  }, [fieldsValues]);
  return (
    <div className="w-full xl:overflow-x-auto">
      <Table className="w-full md:table-fixed">
        <TableBody>
          <TableRow>
            {fieldsValues?.map((_hour, idx) => (
              <TableCell key={idx} className=" text-center">
                <NumericInput
                  fieldName={`report.cashVerify.${idx}.value`}
                  className="w-full text-center"
                  disabled={disabled}
                />
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            {fieldsValues?.map((hour, idx) => (
              <TableCell key={idx} className=" text-center text-xs">
                {hour.hours}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
