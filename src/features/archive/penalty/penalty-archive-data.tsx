"use client";
import LinkEditButton from "@/components/buttons/link-edit-button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { PENALTY_UPDATE_MAIN_ROUTE } from "@/constants/route-tag";
import { GetRemarksData } from "@/features/penalty/model/type";
import { useMonthDays } from "@/hooks/use-month-days";

export default function PenaltyArchiveData({
  data,
  isAdmin,
}: {
  data: GetRemarksData[] | null;
  isAdmin: boolean;
}) {
  const { month, year } = useMonthDays();

  if (!data) return null;

  const sortedData = [...data].sort((a, b) => Number(b.id) - Number(a.id));
  return (
    <>
      {sortedData.map((item, index) => {
        return (
          <Collapsible key={item.id} defaultOpen={index === 0}>
            <Card className="bg-background! my-2 cursor-pointer shadow-none md:m-2">
              <CollapsibleTrigger asChild>
                <CardTitle className="text-bl p-4 text-xs">
                  <div className="flex w-full items-center justify-between">
                    <span>day: {item.id}</span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <LinkEditButton
                        url={`/${PENALTY_UPDATE_MAIN_ROUTE}/${item.id}?month=${month}&year=${year}`}
                        disabled={!isAdmin}
                      />
                    </div>
                  </div>
                </CardTitle>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="flex flex-col gap-4">
                  <Table className="table-fixed">
                    <TableBody>
                      {item.remarks.map((row, index) => {
                        return (
                          <TableRow
                            key={index}
                            className="hover:text-rd hover:bg-accent cursor-pointer [&>td]:py-1 [&>td]:text-xs"
                          >
                            <TableCell className="w-4 p-0 text-xs md:w-8">
                              {index + 1}
                            </TableCell>
                            <TableCell className="bg-background/90 sticky left-0 z-20 w-30 text-xs md:w-40 md:bg-inherit">
                              {row.name}
                            </TableCell>
                            <TableCell className="w-12 md:w-24">
                              {row.dayHours && (
                                <span>
                                  day:
                                  <span className="text-bl mx-2">
                                    {row.dayHours}
                                  </span>
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="w-12 md:w-24">
                              {row.nightHours && (
                                <span>
                                  night:
                                  <span className="text-bl mx-2">
                                    {row.nightHours}
                                  </span>
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-bl w-12 text-center md:w-24">
                              {row.bonus ? `+ ${row.bonus}` : ""}
                            </TableCell>
                            <TableCell className="text-rd w-12 text-center md:w-24">
                              {row.penalty ? `- ${row.penalty}` : ""}
                            </TableCell>
                            <TableCell className="md:pl-6">
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
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </>
  );
}
