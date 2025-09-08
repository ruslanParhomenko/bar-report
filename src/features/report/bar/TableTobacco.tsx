"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Label } from "@/components/ui/label";
import { tobaccoDefault, TobaccoSchemaType } from "./schema";
import SelectField from "@/components/inputs/SelectField";
import { SELECT_COUNT } from "./constants";
import { useFormContext, useWatch } from "react-hook-form";
import { useAbility } from "@/providers/AbilityProvider";
import NumericInput from "@/components/inputs/NumericInput";

export default function TableTobacco() {
  const { isObserver, isUser } = useAbility();

  const isDisabled = isObserver || isUser;

  const { control } = useFormContext();
  const tobacco =
    (useWatch({ name: "tobacco", control }) as TobaccoSchemaType) ||
    tobaccoDefault;

  return (
    <div className="w-full">
      <Label className="text-lg font-semibold pb-7 text-bl">Tobacco</Label>
      <Table className="w-full [&_th]:text-center [&_td]:text-center">
        <TableHeader>
          <TableRow className="h-10">
            <TableHead className="md:w-40 w-30"></TableHead>
            <TableHead className="w-30">stock</TableHead>
            <TableHead className="w-20">+</TableHead>
            <TableHead className="w-20">-</TableHead>
            <TableHead className="w-30">final</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tobacco?.map((item, idx) => (
            <TableRow key={idx} className="h-10">
              <TableCell className="px-2">{item.name}</TableCell>
              <TableCell className="px-2">{item.stock}</TableCell>
              <TableCell className="px-2">
                <NumericInput
                  fieldName={`tobacco.${idx}.incoming`}
                  disabled={isDisabled}
                  className="h-8!"
                />
              </TableCell>
              <TableCell className="px-2">
                <NumericInput
                  fieldName={`tobacco.${idx}.outgoing`}
                  disabled={isDisabled}
                  className="h-8!"
                />
              </TableCell>
              <TableCell className="px-2">
                {(
                  Number(item.stock || 0) +
                  Number(item.incoming ?? 0) -
                  Number(item.outgoing ?? 0)
                ).toString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
