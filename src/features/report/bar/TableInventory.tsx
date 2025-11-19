"use client";
import NumericInput from "@/components/inputs/NumericInput";
import SelectFieldWithSearch from "@/components/inputs/SelectWithSearch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { inventoryDefault, InventorySchemaType } from "./schema";
import { PRODUCTS } from "./constants";
import { useAbility } from "@/providers/AbilityProvider";
import { useFormContext } from "react-hook-form";
import { Trash2Icon } from "lucide-react";
import { useEffect } from "react";
import { formatNow } from "@/utils/formatNow";

export function TableInventory() {
  const { isObserver, isUser } = useAbility();
  const isDisabled = isObserver || isUser;
  const form = useFormContext();

  const reset = (idx: number) => {
    const current = form.getValues("inventory");
    current[idx] = inventoryDefault[idx];
    form.setValue("inventory", current);
  };
  const fieldsValues = form.watch("inventory") as InventorySchemaType;

  useEffect(() => {
    const subscription = form.watch((_, { name: changedName }) => {
      if (
        changedName?.startsWith("inventory.") &&
        changedName.endsWith(".quantity")
      ) {
        const idx = Number(changedName.split(".")[1]);

        const nameValue = form.getValues(`inventory.${idx}.quantity`);
        if (nameValue) {
          form.setValue(`inventory.${idx}.time`, formatNow());
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form]);
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
          <TableHead className="md:w-25">product</TableHead>
          <TableHead className="md:w-10">quantity</TableHead>
          <TableHead className="md:w-10">time</TableHead>
          <TableHead className="md:w-8">action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fieldsValues?.map((_, idx) => (
          <TableRow key={idx}>
            <TableCell>
              <SelectFieldWithSearch
                data={PRODUCTS}
                fieldName={`inventory.${idx}.name`}
                disabled={isDisabled}
                className="h-8 w-full text-center"
              />
            </TableCell>
            <TableCell className="flex items-center justify-center">
              <NumericInput
                fieldName={`inventory.${idx}.quantity`}
                disabled={isDisabled}
                className="w-10! text-center h-8!"
              />
            </TableCell>
            <TableCell className="text-xs text-rd">
              {form.watch(`inventory.${idx}.time`)}
            </TableCell>

            <TableCell onClick={() => reset(idx)} className="cursor-pointer">
              {fieldsValues?.[idx]?.name && (
                <Trash2Icon className="w-4 h-4 mx-2 text-rd" />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
