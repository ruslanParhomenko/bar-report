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

export default function TableCashVerify({
  disabled = false,
}: {
  disabled?: boolean;
}) {
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
    <div className="w-full xl:overflow-x-auto">
      <Table className="w-full md:table-fixed">
        <TableBody>
          <TableRow>
            {fieldsValues.map((_hour, idx) => (
              <TableCell key={idx} className=" text-center">
                <NumericInput
                  fieldName={`cashVerify.${idx}.value`}
                  className="w-full text-center"
                  disabled={disabled}
                />
              </TableCell>
            ))}
          </TableRow>

          <TableRow>
            {fieldsValues.map((hour, idx) => (
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
