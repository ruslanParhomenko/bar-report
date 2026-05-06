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
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { TobaccoSchemaType } from "./schema";

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
          <TableHead className="text-bl font-bold md:w-26">Tobacco</TableHead>
          <TableHead className="w-11" />
          <TableHead className="w-11 text-center">+</TableHead>
          <TableHead className="w-11 text-center">-</TableHead>
          <TableHead className="w-11" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields?.map((item, idx) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{values?.[idx].name}</TableCell>
            <TableCell>
              <NumericInput
                fieldName={`report.tobacco.${idx}.stock`}
                className="w-12 border-0! bg-transparent! shadow-none"
                disabled
              />
            </TableCell>
            <TableCell>
              <NumericInput
                fieldName={`report.tobacco.${idx}.incoming`}
                disabled={disabled}
              />
            </TableCell>
            <TableCell>
              <NumericInput
                fieldName={`report.tobacco.${idx}.outgoing`}
                disabled={disabled}
              />
            </TableCell>
            <TableCell className="text-center">
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
