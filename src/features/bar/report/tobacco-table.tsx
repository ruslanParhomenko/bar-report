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
    <Table className="w-full [&_th]:text-center [&_td]:text-center">
      <TableHeader>
        <TableRow>
          <TableHead className="md:w-40 w-30 font-bold text-bl">
            Tobacco
          </TableHead>
          <TableHead className="w-30" />
          <TableHead className="w-20">+</TableHead>
          <TableHead className="w-20">-</TableHead>
          <TableHead className="w-30" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {tobacco?.map((item, idx) => (
          <TableRow key={idx}>
            <TableCell className="px-2 h-12">{item.name}</TableCell>
            <TableCell className="px-2">
              <NumericInput
                fieldName={`report.tobacco.${idx}.stock`}
                className="h-8 border-0! shadow-none"
                disabled
              />
            </TableCell>
            <TableCell className="px-2">
              <NumericInput
                fieldName={`report.tobacco.${idx}.incoming`}
                className="h-8"
                disabled={disabled}
              />
            </TableCell>
            <TableCell className="px-2">
              <NumericInput
                fieldName={`report.tobacco.${idx}.outgoing`}
                className="h-8"
                disabled={disabled}
              />
            </TableCell>
            <TableCell className="px-2">
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
