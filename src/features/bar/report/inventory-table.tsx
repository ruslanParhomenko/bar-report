"use client";
import NumericInput from "@/components/inputs/numeric-input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormContext, useWatch } from "react-hook-form";
import { Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { formatNow } from "@/utils/format-date";
import { INVENTORY_DATA } from "./constants";
import { InventorySchemaType } from "./schema";

export function TableInventory({ disabled = false }: { disabled?: boolean }) {
  const { control, setValue, register } = useFormContext();

  const reset = (idx: number) => {
    setValue(
      `report.inventory.${idx}`,
      {
        name: INVENTORY_DATA[idx],
        quantity: "",
        time: "",
      },
      { shouldDirty: true, shouldTouch: true },
    );
  };
  const fieldsValues = useWatch({
    name: "report.inventory",
    control,
  }) as InventorySchemaType[];

  useEffect(() => {
    fieldsValues?.forEach((item, idx) => {
      if (item?.quantity && !item?.time) {
        setValue(`report.inventory.${idx}.time`, formatNow(), {
          shouldDirty: true,
        });
      }
    });
  }, [fieldsValues]);
  return (
    <Table className="md:table-fixed">
      <TableHeader>
        <TableRow className="h-10">
          <TableHead className="md:w-30 font-bold text-bl">
            Inventory
            <span className="text-red-600 text-xs px-2">(к концу дня)</span>
          </TableHead>
          <TableHead className="w-10" />
          <TableHead className="w-11" />
          <TableHead className="w-8" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {fieldsValues?.map((_, idx) => (
          <TableRow key={idx}>
            <TableCell className="py-1.5 font-medium">
              <input
                {...register(`report.inventory.${idx}.name`)}
                disabled
                className="h-6 w-full"
              />
            </TableCell>
            <TableCell className="py-0">
              <NumericInput
                fieldName={`report.inventory.${idx}.quantity`}
                className="w-8! text-center h-7!"
                disabled={disabled}
              />
            </TableCell>
            <TableCell className="text-xs text-rd py-0">
              {fieldsValues?.[idx]?.time}
            </TableCell>

            <TableCell
              onClick={() => !disabled && reset(idx)}
              className="cursor-pointer py-0"
            >
              {fieldsValues?.[idx]?.quantity && (
                <Trash2Icon className="w-4 h-4 text-rd" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
