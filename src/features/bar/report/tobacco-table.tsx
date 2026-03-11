"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { defaultTobaccoValue, TobaccoSchemaType } from "./schema";
import { useFormContext, useWatch } from "react-hook-form";
import NumericInput from "@/components/inputs/numeric-input";

export default function TableTobacco({
  disabled = false,
}: {
  disabled?: boolean;
}) {
  const { control } = useFormContext();
  const tobacco = (useWatch({
    name: "report.tobacco",
    control,
  }) as TobaccoSchemaType[]) || [defaultTobaccoValue];

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
        {tobacco?.map((item, idx) => (
          <TableRow key={idx}>
            <TableCell className="px-2 py-2 font-bold">{item.name}</TableCell>
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
                className="h-7"
                disabled={disabled}
              />
            </TableCell>
            <TableCell className="py-0">
              <NumericInput
                fieldName={`report.tobacco.${idx}.outgoing`}
                className="h-7"
                disabled={disabled}
              />
            </TableCell>
            <TableCell className="py-0 text-center">
              {(
                Number(item.stock ?? 0) +
                Number(item.incoming ?? 0) -
                Number(item.outgoing ?? 0)
              ).toString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
