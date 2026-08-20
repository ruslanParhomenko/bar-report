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
import { INVENTORY_DATA } from "@/features/report-bar/model/constants";
import { formatNow } from "@/utils/format-date";
import { Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

export function TableInventory() {
  const { control, setValue, register } = useFormContext<BarForm>();

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
  });

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
        <TableRow>
          <TableHead className="text-bl font-bold md:w-30">
            Inventory
            <span className="text-xs text-red-600">(к концу дня)</span>
          </TableHead>
          <TableHead className="w-10" />
          <TableHead className="w-11" />
          <TableHead className="w-8" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {fieldsValues?.map((_, idx) => (
          <TableRow key={idx}>
            <TableCell className="font-medium">
              <input
                {...register(`report.inventory.${idx}.name`)}
                disabled
                className="w-full"
              />
            </TableCell>
            <TableCell>
              <NumericInput fieldName={`report.inventory.${idx}.quantity`} />
            </TableCell>
            <TableCell className="text-rd text-xs">
              {fieldsValues?.[idx]?.time}
            </TableCell>

            <TableCell onClick={() => reset(idx)} className="cursor-pointer">
              {fieldsValues?.[idx]?.quantity && (
                <Trash2Icon className="text-rd h-4 w-4" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
