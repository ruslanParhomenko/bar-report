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
import { inventoryDefault } from "./schema";
import { INVENTORY_DATA, PRODUCTS } from "./constants";
import { useAbility } from "@/providers/AbilityProvider";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";

export function TableInventory() {
  const { isObserver, isUser } = useAbility();
  const isDisabled = isObserver || isUser;
  const form = useFormContext();

  const reset = (idx: number) => {
    const current = form.getValues("inventory");
    current[idx] = inventoryDefault[idx];
    form.setValue("inventory", current);
  };
  const fieldsValues = form.watch("inventory");
  return (
    <Table className="w-full [&_th]:text-center [&_td]:text-center">
      <TableHeader>
        <TableRow className="h-10">
          <TableHead>product</TableHead>
          <TableHead>quantity</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {INVENTORY_DATA?.map((_, idx) => (
          <TableRow key={idx}>
            <TableCell>
              <SelectFieldWithSearch
                data={PRODUCTS}
                fieldName={`inventory.${idx}.name`}
                disabled={isDisabled}
                className="h-8 w-full text-center min-w-30!"
              />
            </TableCell>
            <TableCell className="flex items-center justify-center">
              <NumericInput
                fieldName={`inventory.${idx}.quantity`}
                disabled={isDisabled}
                className="w-12! text-center h-8!"
              />
            </TableCell>

            <TableCell>
              {fieldsValues?.[idx]?.name && (
                <Button
                  type="button"
                  variant={"destructive"}
                  className="h-8 cursor-pointer"
                  onClick={() => reset(idx)}
                >
                  X
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
