"use client";

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
import { useMemo } from "react";
import { Printer } from "lucide-react";
import { usePrint } from "@/hooks/useToPrint";
import { useTranslations } from "next-intl";
import PrintButton from "@/components/buttons/PrintButton";

export type PenaltyTableProps = Omit<Remark, "id" | "reportId"> & {
  date?: string;
  month: string;
};
interface GroupedData {
  dayHours: number;
  nightHours: number;
  bonus: number;
  penality: number;
}

export default function TotalPenalty({ data }: { data: PenaltyTableProps[] }) {
  const t = useTranslations("Home");
  const { formattedData, totalBonus, totalPenalty } = useMemo(() => {
    const grouped: Record<string, GroupedData> = {};

    data.forEach((item) => {
      if (!item.name) return;

      const name = item.name.trim();
      const day = Number(item.dayHours) || 0;
      const night = Number(item.nightHours) || 0;
      const bonus = Number(item.bonus) || 0;
      const penalty = Number(item.penality) || 0;

      if (!grouped[name]) {
        grouped[name] = {
          dayHours: 0,
          nightHours: 0,
          bonus: 0,
          penality: 0,
        };
      }

      grouped[name].dayHours += day;
      grouped[name].nightHours += night;
      grouped[name].bonus += bonus;
      grouped[name].penality += penalty;
    });

    const formatted = Object.entries(grouped).map(([name, sums]) => ({
      name,
      ...sums,
    }));

    const totalPen = formatted.reduce((acc, r) => acc + (r.penality || 0), 0);
    const totalBon = formatted.reduce((acc, r) => acc + (r.bonus || 0), 0);

    return {
      formattedData: formatted,
      totalBonus: totalBon,
      totalPenalty: totalPen,
    };
  }, [data]);

  const { componentRef, handlePrint } = usePrint({ title: "Table penalty" });
  return (
    <Card className="shadow-md border rounded-2xl md:px-10">
      <CardContent className="space-y-4">
        <PrintButton onPrint={handlePrint} />
        <div ref={componentRef}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 bg-background/90 md:bg-inherit z-20">
                  {t("name")}
                </TableHead>
                <TableHead className="text-center">{t("dayHours")}</TableHead>
                <TableHead className="text-center">{t("nightHours")}</TableHead>
                <TableHead className="text-center">{t("bonus")}</TableHead>
                <TableHead className="text-center">{t("penalty")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formattedData.map((row, index) => (
                <TableRow key={index} className="hover:text-rd hover:bg-accent">
                  <TableCell className="sticky left-0 bg-background/90 md:bg-inherit z-20">
                    {row.name}
                  </TableCell>
                  <TableCell className="text-center">{row.dayHours}</TableCell>
                  <TableCell className="text-center">
                    {row.nightHours}
                  </TableCell>
                  <TableCell className="text-center">{row.bonus}</TableCell>
                  <TableCell className="text-center">{row.penality}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-semibold">
                <TableCell className="text-right" colSpan={3}>
                  {t("total")}:
                </TableCell>
                <TableCell className="text-center">{totalBonus}</TableCell>
                <TableCell className="text-center">{totalPenalty}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
