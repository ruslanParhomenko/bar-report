"use client";
import { DeleteListButton } from "@/components/buttons/DeleteListButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { REPORT_BAR_ENDPOINT } from "@/constants/endpoint-tag";
import { CashVerify } from "@/generated/prisma";
import React from "react";

export const ReportBarTable = ({
  data,
  invalidate,
}: {
  data: any;
  invalidate?: () => void;
}) => {
  return (
    <>
      {data.length > 0 &&
        data.map((item: any, index: number) => (
          <React.Fragment key={item.id || index}>
            <DeleteListButton
              data={item}
              nameTag={REPORT_BAR_ENDPOINT}
              invalidate={invalidate}
            />

            <div className="border border-border rounded-md md:p-4">
              <div className="grid grid-cols-1 md:grid-cols-[25%_75%] pb-4">
                {item?.tobacco ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center text-bl font-bold">
                          Tobacco
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {item?.tobacco?.map((t: any) => (
                        <TableRow key={t.id}>
                          <TableCell>{t?.name}</TableCell>
                          <TableCell className="text-center">
                            {t?.stock.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            {t?.incoming.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            {t?.outgoing.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            {t?.finalStock?.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div></div>
                )}
                <div className="flex flex-col w-full px-10">
                  <div className="grid md:grid-cols-[15%_30%_30%] gap-25 pt-10 md:pt-0">
                    {item?.expenses ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className=" text-bl font-bold">
                              expenses
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {item?.expenses
                            ?.filter((e: any) => e.name !== "")
                            .map((e: any, idx: number) => (
                              <TableRow key={idx}>
                                <TableCell>{e.name || "—"} :</TableCell>
                                <TableCell>{e.sum || "0"}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div></div>
                    )}
                    {item?.productTransfer && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-bl font-bold">
                              transfer
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {item?.productTransfer
                            ?.filter((e: any) => e.name !== "")
                            .map((e: any, idx: number) => (
                              <TableRow key={idx}>
                                <TableCell>{e.name || "—"} :</TableCell>
                                <TableCell>{e.quantity || "0"}</TableCell>
                                <TableCell>{e.destination || "-"}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    )}
                    {item?.inventory && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className=" text-bl font-bold">
                              inventory
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {item?.inventory?.map((e: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell>{e.name || "—"}</TableCell>
                              <TableCell className="flex items-center justify-center">
                                {e.quantity || "0"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                  <div className="mt-auto">
                    {item?.notes && (
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-bold text-bl">
                              notes:
                            </TableCell>
                            <TableCell>{item.notes}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    )}
                  </div>
                  <div className="mt-auto">
                    {item?.cashVerify && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead
                              colSpan={item.cashVerify?.length || 1}
                              className="text-bl font-bold"
                            >
                              cash verify
                            </TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          <TableRow>
                            {item.cashVerify
                              ?.filter((c: CashVerify) => c.value !== "0")
                              .map((c: CashVerify) => (
                                <TableCell key={`h-${c.id}`}>
                                  {c?.hours?.split(":")[0] || "—"}
                                </TableCell>
                              ))}
                          </TableRow>
                          <TableRow>
                            {item.cashVerify
                              ?.filter((c: CashVerify) => c.value !== "0")
                              .map((c: CashVerify) => (
                                <TableCell key={`v-${c.id}`}>
                                  {c.value || "—"}
                                </TableCell>
                              ))}
                          </TableRow>
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
    </>
  );
};
