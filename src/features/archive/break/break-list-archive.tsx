"use client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";

import { GetBreakData } from "@/app/actions/break/break-action";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { TIME_LABELS } from "@/features/bar/break-form/constant";

export function BreakListArchive({ data }: { data: GetBreakData[] | null }) {
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

  const reversed = [...data].reverse();

  return (
    <>
      {reversed.map((item, index) => {
        const isOpen = opened.includes(index);

        return (
          <Card
            key={index}
            className="bg-background! m-2 cursor-pointer shadow-none"
            onClick={() => toggle(index)}
          >
            {/* card + day */}
            <CardTitle className="text-bl p-4 text-xs">
              day: {item.id}
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
                          <TableCell className="bg-background sticky left-0 py-1 md:w-30">
                            {row.name ?? "-"}
                          </TableCell>
                          <TableCell className="text-gr text-center text-xs">
                            {row.id}
                          </TableCell>

                          {TIME_LABELS.map((hour, indexHour) => {
                            const value = row.hours[indexHour];
                            const isView = ["00", "20", "40"].includes(value);
                            return (
                              <TableCell
                                key={`${row.id}-${indexHour}`}
                                className="text-bl text-center text-xs"
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
