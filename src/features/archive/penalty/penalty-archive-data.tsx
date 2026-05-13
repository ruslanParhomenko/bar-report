"use client";
import { GetRemarksData } from "@/app/actions/remarks/remarks-action";
import LinkEditButton from "@/components/buttons/link-edit-button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PENALTY_UPDATE_MAIN_ROUTE } from "@/constants/route-tag";
import { useMonthDays } from "@/providers/month-days-provider";
import { useEffect, useState } from "react";

export default function PenaltyArchiveData({
  data,
}: {
  data: GetRemarksData[] | null;
}) {
  const { month, year } = useMonthDays();
  const [opened, setOpened] = useState<number[]>([]);
  useEffect(() => {
    if (!data) return;
    if (data.length > 0) {
      setOpened([0]);
    }
  }, [data]);

  const toggle = (index: number) => {
    setOpened((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const sorted = data
    ? [...data].sort((a, b) => Number(b.id) - Number(a.id))
    : [];
  return (
    <>
      {sorted.map((item, index) => {
        const isOpen = opened.includes(index);

        return (
          <Card
            key={index}
            className="bg-background! cursor-pointer shadow-none md:m-2"
            onClick={() => toggle(index)}
          >
            <CardTitle className="text-bl p-4 text-xs">
              <div className="flex w-full items-center justify-between">
                <span>day: {item.id}</span>
                <div onClick={(e) => e.stopPropagation()}>
                  <LinkEditButton
                    url={`/${PENALTY_UPDATE_MAIN_ROUTE}/${item.id}?month=${month}&year=${year}`}
                  />
                </div>
              </div>
            </CardTitle>
            {isOpen && (
              <CardContent className="flex flex-col gap-4">
                <Table className="table-fixed">
                  <TableBody>
                    {item.remarks.map((row, index) => {
                      return (
                        <TableRow
                          key={index}
                          className="hover:text-rd hover:bg-accent cursor-pointer [&>td]:py-1 [&>td]:text-xs"
                        >
                          <TableCell className="w-8 text-xs">
                            {index + 1}
                          </TableCell>
                          <TableCell className="bg-background/90 sticky left-0 z-20 w-40 text-xs md:bg-inherit">
                            {row.name}
                          </TableCell>
                          <TableCell className="w-24">
                            {row.dayHours && (
                              <span>
                                day:
                                <span className="text-bl mx-2">
                                  {row.dayHours}
                                </span>
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="w-24">
                            {row.nightHours && (
                              <span>
                                night:
                                <span className="text-bl mx-2">
                                  {row.nightHours}
                                </span>
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-bl w-24 text-center">
                            {row.bonus ? `+ ${row.bonus}` : ""}
                          </TableCell>
                          <TableCell className="text-rd w-24 text-center">
                            {row.penalty ? `- ${row.penalty}` : ""}
                          </TableCell>
                          <TableCell className="pl-6">
                            {row.reason && (
                              <span>
                                reason:
                                <span className="text-bl mx-2">
                                  {row.reason}
                                </span>
                              </span>
                            )}
                          </TableCell>
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
