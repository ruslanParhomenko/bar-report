"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TobaccoSchemaType } from "./schema";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import NumericInput from "@/components/inputs-form/numeric-input";

export default function TableTobacco({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const { control } = useFormContext();

  const { fields } = useFieldArray({
    control,
    name: "report.tobacco",
  });
  const values = useWatch({
    control,
    name: "report.tobacco",
  }) as TobaccoSchemaType[];

  return (
    <Table className="md:table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="md:w-26 font-bold text-bl">Tobacco</TableHead>
          <TableHead className="w-11" />
          <TableHead className="w-11 text-center">+</TableHead>
          <TableHead className="w-11 text-center">-</TableHead>
          <TableHead className="w-11" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields?.map((item, idx) => (
          <TableRow key={item.id}>
            <TableCell className="px-2 py-2 font-medium">
              {values[idx].name}
            </TableCell>
            <TableCell className="py-0">
              <NumericInput
                fieldName={`report.tobacco.${idx}.stock`}
                className="h-6 border-0! shadow-none p-0"
                disabled
              />
            </TableCell>
            <TableCell className="py-0">
              <NumericInput
                fieldName={`report.tobacco.${idx}.incoming`}
                className="h-7 p-0"
                disabled={disabled}
              />
            </TableCell>
            <TableCell className="py-0">
              <NumericInput
                fieldName={`report.tobacco.${idx}.outgoing`}
                className="h-7 p-0"
                disabled={disabled}
              />
            </TableCell>
            <TableCell className="py-0 text-center">
              {(
                Number(values[idx].stock ?? 0) +
                Number(values[idx].incoming ?? 0) -
                Number(values[idx].outgoing ?? 0)
              ).toString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
