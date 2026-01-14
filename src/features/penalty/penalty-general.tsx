"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Remark } from "@/generated/prisma";

import { useTranslations } from "next-intl";
import PrintButton from "@/components/buttons/PrintButton";
import { remarksByUniqueEmployee } from "./utils";
import { useRef } from "react";

export type PenaltyTableProps = Omit<Remark, "id" | "reportId"> & {
  date?: string;
  month: string;
};

export default function PenaltyGeneral({
  data,
}: {
  data: PenaltyTableProps[];
}) {
  const t = useTranslations("Home");

  const componentRef = useRef<HTMLDivElement>(null);

  const { formattedData, totalBonus, totalPenalty } =
    remarksByUniqueEmployee(data);
  return (
    <div ref={componentRef} className="pt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <PrintButton componentRef={componentRef} className="" />
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
              <TableCell className="sticky left-0 bg-background/20 z-10 print:bg-none">
                {row.name}
              </TableCell>
              <TableCell className="text-center">{row.dayHours}</TableCell>
              <TableCell className="text-center">{row.nightHours}</TableCell>
              <TableCell className="text-center">{row.bonus}</TableCell>
              <TableCell className="text-center">{row.penalty}</TableCell>
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
  );
}
