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
import { useFormContext, useWatch } from "react-hook-form";

export default function TableTobacco() {
  const { control } = useFormContext<BarForm>();

  const values = useWatch({
    control,
    name: "report.tobacco",
  });

  return (
    <Table className="md:table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="text-bl pl-8 font-bold md:w-26">
            Tobacco
          </TableHead>
          <TableHead className="w-11" />
          <TableHead className="w-11 text-center">+</TableHead>
          <TableHead className="w-11 text-center">-</TableHead>
          <TableHead className="w-11" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {values?.map((item, idx) => (
          <TableRow key={item.name} className="[&>td]:py-2">
            <TableCell className="text-gr pl-4 tracking-wider">
              {item.name}
            </TableCell>
            <TableCell className="text-muted-foreground text-center">
              {Number(item.stock ?? 0)}
            </TableCell>
            <TableCell className="text-bl text-center">
              <NumericInput fieldName={`report.tobacco.${idx}.incoming`} />
            </TableCell>
            <TableCell className="text-rd text-center">
              <NumericInput fieldName={`report.tobacco.${idx}.outgoing`} />
            </TableCell>
            <TableCell className="text-muted-foreground text-center">
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
