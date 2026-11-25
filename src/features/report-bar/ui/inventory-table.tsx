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
import { useFormContext, useWatch } from "react-hook-form";

export function TableInventory() {
  const { control, setValue } = useFormContext<BarForm>();

  const fieldsValues = useWatch({
    name: "report.inventory",
    control,
  });

  return (
    <Table className="md:table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="text-bl pl-8 font-bold md:w-30">
            Inventory
            <span className="px-2 text-xs text-red-600">(к концу дня)</span>
          </TableHead>
          <TableHead className="w-10" />
          <TableHead className="w-11" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {fieldsValues?.map((item, idx) => (
          <TableRow key={idx} className="[&>td]:py-1.5">
            <TableCell className="text-gr pl-4 tracking-wider">
              {item?.name}
            </TableCell>
            <TableCell className="text-bl text-center">
              <NumericInput
                fieldName={`report.inventory.${idx}.quantity`}
                onValueChange={() =>
                  setValue(`report.inventory.${idx}.time`, formatNow(), {
                    shouldDirty: true,
                  })
                }
              />
            </TableCell>
            <TableCell className="text-rd text-center text-xs">
              {fieldsValues?.[idx]?.time}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
