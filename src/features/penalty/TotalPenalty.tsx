import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Remark } from "@/generated/prisma";
import { useMemo, useRef } from "react";
import { Printer } from "lucide-react";

export type PenaltyTableProps = Omit<Remark, "id" | "reportId"> & {
  date?: string;
  month: string;
};

export default function TotalPenalty({ data }: { data: PenaltyTableProps[] }) {
  const tableRef = useRef<HTMLDivElement>(null);

  const formattedData = useMemo(() => {
    const grouped: Record<
      string,
      { dayHours: number; nightHours: number; bonus: number; penality: number }
    > = {};

    data.forEach((r) => {
      if (!r.name) return;

      const name = r.name.trim();
      const day = Number(r.dayHours) || 0;
      const night = Number(r.nightHours) || 0;
      const bonus = Number(r.bonus) || 0;
      const penalty = Number(r.penality) || 0;

      if (!grouped[name]) {
        grouped[name] = { dayHours: 0, nightHours: 0, bonus: 0, penality: 0 };
      }

      grouped[name].dayHours += day;
      grouped[name].nightHours += night;
      grouped[name].bonus += bonus;
      grouped[name].penality += penalty;
    });

    return Object.entries(grouped).map(([name, sums]) => ({
      name,
      ...sums,
    }));
  }, [data]);

  const totalPenalty = useMemo(() => {
    return formattedData.reduce((acc, r) => acc + (r.penality || 0), 0);
  }, [formattedData]);

  const handlePrint = () => {
    if (!tableRef.current) return;

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;

    const html = `
    <html>
      <head>
        <title>Печать таблицы</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
          }
          th {
            background-color: #f3f3f3;
          }
          tr:hover {
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
        ${tableRef.current.innerHTML}
      </body>
    </html>
  `;

    // ✅ Дожидаемся готовности документа
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    // 🕒 Немного подождать перед печатью
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };
  return (
    <Card className="shadow-md border rounded-2xl md:px-10">
      <CardContent className="space-y-4">
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2 print:hidden my-4"
          >
            <Printer className="w-4 h-4 " />
            Печать
          </Button>
        </div>
        <div ref={tableRef}>
          {formattedData.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background/90">
                    Сотрудник
                  </TableHead>
                  <TableHead className="text-center">Дневные часы</TableHead>
                  <TableHead className="text-center">Ночные часы</TableHead>
                  <TableHead className="text-center">Бонус</TableHead>
                  <TableHead className="text-center">Штраф</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formattedData.map((row, index) => (
                  <TableRow
                    key={index}
                    className="hover:text-rd hover:bg-accent"
                  >
                    <TableCell className="sticky left-0 bg-background/90">
                      {row.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.dayHours}
                    </TableCell>
                    <TableCell className="text-center">
                      {row.nightHours}
                    </TableCell>
                    <TableCell className="text-center">{row.bonus}</TableCell>
                    <TableCell className="text-center">
                      {row.penality}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-semibold bg-muted/50">
                  <TableCell colSpan={4} className="text-right">
                    Общая сумма штрафов:
                  </TableCell>
                  <TableCell className="text-center">{totalPenalty}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
