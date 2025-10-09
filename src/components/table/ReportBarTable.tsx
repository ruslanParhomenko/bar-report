import { CashVerify } from "@/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { DeleteListButton } from "../buttons/DeleteListButton";
import { REPORT_BAR_ENDPOINT } from "@/constants/endpoint-tag";

const classNameHead = "text-shadow-muted-foreground font-bold";

export default function ReportBarTable({
  data,
  invalidate,
}: {
  data: any;
  invalidate?: () => void;
}) {
  return (
    <Card className="shadow-md border rounded-2xl md:p-4 mb-4">
      <CardHeader>
        <CardTitle>
          <DeleteListButton
            data={data}
            nameTag={REPORT_BAR_ENDPOINT}
            invalidate={invalidate}
          />
        </CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-[25%_75%] pb-4">
        {data?.tobacco ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={classNameHead}>Tobacco</TableHead>
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
        ) : (
          <div></div>
        )}
        <div className="flex flex-col w-full px-10">
          <div className="grid md:grid-cols-[15%_30%_30%] gap-25 pt-10 md:pt-0">
            {data?.expenses ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={classNameHead}>expenses</TableHead>
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
            ) : (
              <div></div>
            )}
            {data?.productTransfer && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={classNameHead}>transfer</TableHead>
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
            )}
            {data?.inventory && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={classNameHead}>inventory</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.inventory?.map((e: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell>{e.name || "—"}</TableCell>
                      <TableCell className="flex datas-center justify-center">
                        {e.quantity || "0"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <div className="mt-auto">
            {data?.notes && (
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className={classNameHead}>notes:</TableCell>
                    <TableCell>{data.notes}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </div>
          <div className="mt-auto">
            {data?.cashVerify && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      colSpan={data.cashVerify?.length || 1}
                      className={classNameHead}
                    >
                      cash verify
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    {data.cashVerify
                      ?.filter((c: CashVerify) => c.value !== "0")
                      .map((c: CashVerify) => (
                        <TableCell key={`h-${c.id}`}>
                          {c?.hours?.split(":")[0] || "—"}
                        </TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
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
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
