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
import { useTranslations } from "next-intl";
import { useMemo } from "react";
export type PenaltyTableProps = Omit<Remark, "id" | "reportId"> & {
  date?: string;
  month: string;
};

export default function PenaltyTable({ data }: { data: PenaltyTableProps[] }) {
  const t = useTranslations("Home");
  const totalPenalty = useMemo(() => {
    return data.reduce((acc, r) => {
      const val = Number(r.penality);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }, [data]);
  const totalBonus = useMemo(() => {
    return data.reduce((acc, r) => {
      const val = Number(r.bonus);
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
                <TableHead>{t("date")}</TableHead>
                <TableHead className="sticky left-0 bg-background/90 md:bg-inherit z-20">
                  {t("employee")}
                </TableHead>
                <TableHead className="text-center">{t("dayHours")}</TableHead>
                <TableHead className="text-center">{t("nightHours")}</TableHead>
                <TableHead>{t("reason")}</TableHead>
                <TableHead className="text-center">{t("bonus")}</TableHead>
                <TableHead className="text-center">{t("penalty")}</TableHead>
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
                    <TableCell className="sticky left-0 bg-background/90 md:bg-inherit z-20">
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
              <TableRow className="font-semibold ">
                <TableCell className="text-right" colSpan={5}>
                  {t("total")}:
                </TableCell>
                <TableCell className="text-center">{totalBonus}</TableCell>
                <TableCell className="text-center">{totalPenalty}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
