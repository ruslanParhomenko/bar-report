"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGoogleData } from "@/hooks/useGoogleData";
import { useTranslations } from "next-intl";

export function StandardKitchenTable() {
  const t = useTranslations("Home");
  const { sk: data } = useGoogleData();

  return (
    <Card className="rounded-2xl shadow-sm py-6 px-10 h-screen flex flex-col">
      <CardHeader className="flex-shrink-0">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              <TableHead>{t("semifabricat")}</TableHead>
              <TableHead className="text-center truncate">
                {t("fridge")} +2…+3°C
              </TableHead>
              <TableHead className="text-center">
                {t("freezer")} -18°C
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto no-scrollbar">
        <Table className="table-fixed w-full">
          <TableBody>
            {data &&
              data
                ?.filter((_emp: any, idx: number) => idx !== 0)
                .map((emp: any, idx: number) => (
                  <TableRow key={`${emp.date}-${idx}`}>
                    <TableCell className="truncate">{emp.name}</TableCell>
                    <TableCell className="text-center truncate">
                      {emp.timePlus ?? "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {emp.timeMinus ?? "-"}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
