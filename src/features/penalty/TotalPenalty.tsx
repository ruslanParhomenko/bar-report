"use client";

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

import { usePrint } from "@/hooks/useToPrint";
import { useTranslations } from "next-intl";
import PrintButton from "@/components/buttons/PrintButton";
import { remarksByUniqueEmployee } from "./utils";

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

  const { formattedData, totalBonus, totalPenalty } =
    remarksByUniqueEmployee(data);
  const { componentRef, handlePrint } = usePrint({ title: "Table penalty" });
  return (
    <Card>
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
