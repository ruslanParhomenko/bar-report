"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

import { GetRemarksData } from "@/app/actions/remarks/remarks-action";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { remarksByUniqueEmployee } from "../penalty/utils";

export default function PenaltyResult({
  data,
}: {
  data: GetRemarksData[] | null;
}) {
  if (!data) return null;
  const t = useTranslations("Home");

  const [selectedEmployee, setSelectedEmployee] = useState("select");

  const names = data
    ?.flatMap((item) => item.remarks?.map((r) => r.name))
    .filter(
      (name): name is string => typeof name === "string" && name.trim() !== "",
    );

  const employeesList = ["select", ...Array.from(new Set(names))].map(
    (name) => ({
      label: name,
      value: name,
    }),
  );
  const sorted = data
    ? [...data].sort((a, b) => Number(b.id) - Number(a.id))
    : [];
  const filteredRows =
    sorted.flatMap((doc) =>
      doc.remarks
        ?.filter(
          (r: any) =>
            selectedEmployee === "select" || r.name === selectedEmployee,
        )
        .map((r: any) => ({
          ...r,
          day: doc.id,
        })),
    ) ?? [];

  const { formattedData, totalBonus, totalPenalty } =
    remarksByUniqueEmployee(data);
  return (
    <Table className="mt-6 table-fixed">
      <TableBody>
        {formattedData.map((row, index) => (
          <React.Fragment key={index}>
            <TableRow key={index} className={cn("hover:text-rd")}>
              <TableCell className="w-8 text-xs">{index + 1}</TableCell>
              <TableCell
                onClick={() =>
                  selectedEmployee !== row.name
                    ? setSelectedEmployee(row.name)
                    : setSelectedEmployee("select")
                }
                className="bg-background sticky left-0 z-10 w-42 cursor-pointer md:w-60 md:bg-transparent print:bg-none"
              >
                {row.name}
              </TableCell>
              <TableCell className="w-24">
                {row.dayHours && (
                  <span>
                    d:
                    <span className="text-bl mx-4">{row.dayHours}</span>
                  </span>
                )}
              </TableCell>
              <TableCell className="w-24">
                {row.nightHours && (
                  <span>
                    n:
                    <span className="text-bl mx-4">{row.nightHours}</span>
                  </span>
                )}
              </TableCell>
              <TableCell className="text-bl w-24 text-center">
                {row.bonus ? `+ ${row.bonus}` : ""}
              </TableCell>
              <TableCell className="text-rd w-24 text-center">
                {row.penalty ? `- ${row.penalty}` : ""}
              </TableCell>
            </TableRow>
            {selectedEmployee === row.name &&
              filteredRows.map((fRow, fIndex) => (
                <TableRow
                  key={`detail-${fIndex}`}
                  className="[&>td]:text-gn [&>td]:py-0 [&>td]:text-xs"
                >
                  <TableCell className="text-xs">{fRow.day}.</TableCell>
                  <TableCell>{fRow.reason}</TableCell>

                  <TableCell>{fRow.dayHours}</TableCell>
                  <TableCell>{fRow.nightHours}</TableCell>
                  <TableCell className="text-center">
                    {fRow.bonus && `+ ${fRow.bonus}`}
                  </TableCell>
                  <TableCell className="text-center">
                    {fRow.penalty && `- ${fRow.penalty}`}
                  </TableCell>
                </TableRow>
              ))}
          </React.Fragment>
        ))}
        <TableRow className="font-semibold">
          <TableCell className="text-right" colSpan={4} />
          <TableCell className="text-bl text-center">+ {totalBonus}</TableCell>
          <TableCell className="text-rd text-center">
            - {totalPenalty}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
