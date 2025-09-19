"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CashVerify } from "@/generated/prisma";

export const ReportBarTable = ({ data }: { data: any }) => {
  return (
    <>
      <div className="border border-gray-200 rounded-md md:p-4">
        <div className="grid grid-cols-1 md:grid-cols-[35%_65%]  pb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tobacco</TableHead>
                <TableHead className="text-center"></TableHead>
                <TableHead className="text-center">in</TableHead>
                <TableHead className="text-center">out</TableHead>
                <TableHead className="text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.tobacco?.map((t: any) => (
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

          <div className="flex flex-col items-start justify-between gap-4 w-full md:pl-15">
            <div className="grid md:grid-cols-2 gap-20 pt-10 md:pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>expenses</TableHead>
                    <TableHead>sum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.expenses
                    ?.filter((e: any) => e.name !== "")
                    .map((e: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>{e.name || "—"} :</TableCell>
                        <TableCell>{e.sum || "0"}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>product</TableHead>
                    <TableHead>quantity</TableHead>
                    <TableHead>destination</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.productTransfer
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
            </div>
            <div className="mt-auto">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold">notes:</TableCell>
                    <TableCell>{data.notes}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="mt-auto">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold">hours:</TableCell>
                    {data.cashVerify
                      ?.filter((c: CashVerify) => c.value !== "0")
                      .map((c: CashVerify) => (
                        <TableCell key={`h-${c.id}`}>
                          {c?.hours?.split(":")[0] || "—"}
                        </TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">value:</TableCell>
                    {data.cashVerify
                      ?.filter((c: CashVerify) => c.value !== "0")
                      .map((c: CashVerify) => (
                        <TableCell key={`v-${c.id}`}>
                          {c.value || "—"}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
