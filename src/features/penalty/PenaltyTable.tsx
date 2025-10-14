import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Remark } from "@/generated/prisma";
import { useMemo } from "react";
export type PenaltyTableProps = Omit<Remark, "id" | "reportId"> & {
  date?: string;
  month: string;
};

export default function PenaltyTable({ data }: { data: PenaltyTableProps[] }) {
  const totalPenalty = useMemo(() => {
    return data.reduce((acc, r) => {
      const val = Number(r.penality);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }, [data]);
  return (
    <Card className="shadow-md border rounded-2xl md:px-10">
      <CardContent>
        {data && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead className="sticky left-0 bg-background/90">
                  Сотрудник
                </TableHead>
                <TableHead className="text-center">Дневные часы</TableHead>
                <TableHead className="text-center">Ночные часы</TableHead>
                <TableHead>Причина</TableHead>
                <TableHead className="text-center">Бонус</TableHead>
                <TableHead className="text-center">Штраф</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data
                ?.filter((r) => r.name)
                .map((row, index) => (
                  <TableRow
                    key={index}
                    className="hover:text-rd hover:bg-accent"
                  >
                    <TableCell>{row.date}</TableCell>
                    <TableCell className="sticky left-0 bg-background/90">
                      {row.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.dayHours}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.nightHours}
                    </TableCell>
                    <TableCell>{row.reason}</TableCell>
                    <TableCell className="text-center">
                      {row.bonus || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.penality || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              <TableRow className="font-semibold bg-muted/50">
                <TableCell colSpan={6} className="text-right">
                  Общая сумма штрафов:
                </TableCell>
                <TableCell>{totalPenalty}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
