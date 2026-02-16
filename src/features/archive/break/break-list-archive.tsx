"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { BreakGetType } from "@/app/actions/break/break-action";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { TIME_LABELS } from "@/features/bar/break-form/constant";

export function BreakListArchive({ data }: { data: BreakGetType | null }) {
  const [opened, setOpened] = useState<number[]>([]);

  useEffect(() => {
    if (!data) return;
    if (reversed.length > 0) {
      setOpened([0]);
    }
  }, [data]);

  const toggle = (index: number) => {
    setOpened((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };
  if (!data) return null;

  const reversed = [...data.data].reverse();

  return (
    <>
      {reversed.map((item, index) => {
        const isOpen = opened.includes(index);

        return (
          <Card
            key={index}
            className="bg-background! shadow-none m-2 cursor-pointer"
            onClick={() => toggle(index)}
          >
            {/* card + day */}
            <CardTitle className="text-xs text-bl p-4">
              day: {item.day}
            </CardTitle>

            {isOpen && (
              <CardContent className="flex flex-col gap-4">
                <Table>
                  <TableBody>
                    {item.rows.map((row, rowIndex) => {
                      return (
                        <TableRow
                          key={row.id + rowIndex}
                          className="hover:text-rd cursor-pointer"
                        >
                          <TableCell className="py-1 md:w-30 sticky left-0 bg-background">
                            {row.name ?? "-"}
                          </TableCell>
                          <TableCell className="text-xs text-gr text-center">
                            {row.id}
                          </TableCell>

                          {TIME_LABELS.map((hour, indexHour) => {
                            const value = row.hours[indexHour];
                            const isView = ["00", "20", "40"].includes(value);
                            return (
                              <TableCell
                                key={`${row.id}-${indexHour}`}
                                className="text-center text-bl text-xs"
                              >
                                {isView && `${hour}:${value}`}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            )}
          </Card>
        );
      })}
    </>
  );
}
