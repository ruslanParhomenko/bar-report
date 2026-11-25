"use client";
import NumericInput from "@/components/input-controlled/numeric-input";
import SelectField from "@/components/input-controlled/select-field";
import SelectFieldWithSearch from "@/components/input-form/select-with-search";
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
import { useFormContext, useWatch } from "react-hook-form";

export default function TableProductsTransfer({
  orderProducts,
  transferTo,
}: {
  orderProducts: string[];
  transferTo: string[];
}) {
  const { control, setValue } = useFormContext<BarForm>();

  const PRODUCTS = [...orderProducts, "-"];
  const TRANSFER_TO = [...transferTo, "-"];

  const fieldsValues = useWatch({
    name: "report.productTransfer",
    control,
  });

  return (
    <Table className="md:table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="text-bl w-28 pl-8 font-bold">
            Transfer
          </TableHead>
          <TableHead className="w-14" />
          <TableHead className="w-14" />
          <TableHead className="w-8" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {fieldsValues?.map((item, idx) => (
          <TableRow key={`${item}-${idx}`}>
            <TableCell>
              <SelectFieldWithSearch
                data={PRODUCTS}
                fieldName={`report.productTransfer.${idx}.name`}
                className="h-8 w-full border-0 text-center text-sm! shadow-none"
                placeHolder="...."
              />
            </TableCell>
            <TableCell>
              <SelectField
                fieldName={`report.productTransfer.${idx}.destination`}
                data={TRANSFER_TO}
                className="h-7! w-full border-0 text-center text-xs font-medium! shadow-none"
                placeHolder="...."
              />
            </TableCell>
            <TableCell>
              <NumericInput
                fieldName={`report.productTransfer.${idx}.quantity`}
                className="w-14 text-center"
                onValueChange={() => {
                  setValue(`report.productTransfer.${idx}.time`, formatNow(), {
                    shouldDirty: true,
                  });
                }}
              />
            </TableCell>
            <TableCell className="text-rd text-xs">
              {fieldsValues?.[idx]?.time}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
