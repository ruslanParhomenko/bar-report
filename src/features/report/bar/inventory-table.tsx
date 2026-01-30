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
import { InventorySchemaType } from "./schema";
import { useFormContext } from "react-hook-form";
import { Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { formatNow } from "@/utils/formatNow";
import { INVENTORY_DATA } from "./constants";

export function TableInventory() {
  const form = useFormContext();

  const reset = (idx: number) => {
    form.setValue(
      `inventory.${idx}`,
      {
        name: INVENTORY_DATA[idx],
        quantity: "",
        time: "",
      },
      { shouldDirty: true, shouldTouch: true },
    );
  };
  const fieldsValues = form.watch("inventory") as InventorySchemaType[];

  useEffect(() => {
    fieldsValues?.forEach((item, idx) => {
      if (item?.quantity && !item?.time) {
        form.setValue(`inventory.${idx}.time`, formatNow(), {
          shouldDirty: true,
        });
      }
    });
  }, [fieldsValues, form]);
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
                {...form.register(`inventory.${idx}.name`)}
                disabled
                className="h-8 w-full"
              />
            </TableCell>
            <TableCell className="flex items-center justify-center">
              <NumericInput
                fieldName={`inventory.${idx}.quantity`}
                className="w-10! text-center h-8!"
              />
            </TableCell>
            <TableCell className="text-xs text-rd">
              {fieldsValues?.[idx]?.time}
            </TableCell>

            <TableCell onClick={() => reset(idx)} className="cursor-pointer">
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
