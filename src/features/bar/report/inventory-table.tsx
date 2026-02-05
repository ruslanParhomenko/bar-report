"use client";
import NumericInput from "@/components/inputs/NumericInput";
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
import { formatNow } from "@/utils/formatNow";
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
    <Table>
      <TableHeader>
        <TableRow className="border-0! flex justify-start">
          <TableHead colSpan={3} className="h-6 font-bold text-bl">
            Inventory
            <span className="text-red-600 text-xs px-2">(к концу дня)</span>
          </TableHead>
        </TableRow>

        <TableRow className="h-10">
          <TableHead className="md:w-25" />
          <TableHead className="md:w-10">кол-во</TableHead>
          <TableHead className="md:w-14" />
          <TableHead className="md:w-12" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {fieldsValues?.map((_, idx) => (
          <TableRow key={idx}>
            <TableCell>
              <input
                {...register(`report.inventory.${idx}.name`)}
                disabled
                className="h-8 w-full"
              />
            </TableCell>
            <TableCell className="flex items-center justify-center">
              <NumericInput
                fieldName={`report.inventory.${idx}.quantity`}
                className="w-10! text-center h-8!"
                disabled={disabled}
              />
            </TableCell>
            <TableCell className="text-xs text-rd">
              {fieldsValues?.[idx]?.time}
            </TableCell>

            <TableCell
              onClick={() => !disabled && reset(idx)}
              className="cursor-pointer"
            >
              {fieldsValues?.[idx]?.quantity && (
                <Trash2Icon className="w-4 h-4 mx-2 text-rd" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
