"use client";
import { deleteRemark } from "@/app/actions/remarks/remarksAction";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "@/i18n/navigation";
import { Remark } from "@/prisma/generated/prisma/client";
import { useAbility } from "@/providers/AbilityProvider";
import { PenBox, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
export type PenaltyTableProps = Omit<Remark, "reportId"> & {
  date?: string;
  month: string;
};

export default function PenaltyDetails({
  data,
}: {
  data: PenaltyTableProps[];
}) {
  const router = useRouter();
  const t = useTranslations("Home");

  const { isAdmin, isManager } = useAbility();
  const employeesList = ["all", ...new Set(data.map((item) => item.name))];

  const [selectedEmployee, setSelectedEmployee] = useState("all");

  const totalPenalty = useMemo(() => {
    return data.reduce((acc, r) => {
      const val = Number(r.penalty);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }, [data]);
  const totalBonus = useMemo(() => {
    return data.reduce((acc, r) => {
      const val = Number(r.bonus);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }, [data]);

  const editRemarks = (id: string) => {
    if (!isAdmin && !isManager) return;
    router.push(`/penalty/form/${id}`);
  };
  const deleteRemarks = async (id: string) => {
    if (!isAdmin) return;
    await deleteRemark(id);
  };
  return (
    <div className="overflow-hidden max-h-[92vh] flex flex-col">
      <div className="overflow-y-auto">
        {data && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-36"></TableHead>
                <TableHead className="p-0">
                  <Select
                    value={selectedEmployee}
                    onValueChange={(value) => setSelectedEmployee(value)}
                    defaultValue="all"
                  >
                    <SelectTrigger className="w-30 shadow-none h-7! p-0 border-0 text-muted-foreground [&>svg]:hidden justify-start">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {employeesList.map((name, idx) => (
                        <SelectItem key={`${name}-${idx}`} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableHead>
                <TableHead className="text-center">{t("dayHours")}</TableHead>
                <TableHead className="text-center">{t("nightHours")}</TableHead>
                <TableHead className="w-60"></TableHead>
                <TableHead className="text-center">{t("bonus")}</TableHead>
                <TableHead className="text-center">{t("penalty")}</TableHead>
                <TableHead className="text-center w-10">action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data
                .filter((row) =>
                  selectedEmployee === "all"
                    ? row
                    : row.name === selectedEmployee,
                )
                .map((row, index) => (
                  <TableRow
                    key={index}
                    className="hover:text-rd hover:bg-accent"
                  >
                    <TableCell className="p-1 text-xs">{row.date}</TableCell>
                    <TableCell className="sticky left-0 bg-background/90 md:bg-inherit z-20 p-0 text-xs">
                      {row.name}
                    </TableCell>
                    <TableCell className="text-center p-0 text-xs">
                      {row.dayHours}
                    </TableCell>
                    <TableCell className="text-center p-0 text-xs">
                      {row.nightHours}
                    </TableCell>
                    <TableCell className="p-0 text-xs">{row.reason}</TableCell>
                    <TableCell className="text-center p-0 text-xs">
                      {row.bonus}
                    </TableCell>
                    <TableCell className="text-center p-0 text-xs">
                      {row.penalty}
                    </TableCell>
                    <TableCell className="flex justify-between items-center h-6 cursor-pointer p-0">
                      <PenBox
                        className="w-4 h-3.5 text-bl"
                        onClick={() => editRemarks(row.id.toLocaleString())}
                      />
                      <Trash2
                        className="w-4 h-3.5 text-rd mr-2"
                        onClick={() => deleteRemarks(row.id.toLocaleString())}
                      />
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
      </div>
    </div>
  );
}
