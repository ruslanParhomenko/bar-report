import { deleteRemark } from "@/app/actions/remarks/remarksAction";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Remark } from "@/generated/prisma";
import { useRouter } from "@/i18n/navigation";
import { useAbility } from "@/providers/AbilityProvider";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
export type PenaltyTableProps = Omit<Remark, "reportId"> & {
  date?: string;
  month: string;
};

export default function PenaltyTable({ data }: { data: PenaltyTableProps[] }) {
  const router = useRouter();
  const t = useTranslations("Home");

  const { isAdmin, isManager } = useAbility();

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
    router.push(`/remarks/${id}`);
  };
  const deleteRemarks = async (id: string) => {
    if (!isAdmin) return;
    await deleteRemark(id);
  };
  return (
    <div className="overflow-hidden max-h-[92vh] flex flex-col">
      <div className="overflow-y-auto">
        {data && (
          <Table className="no-scrollbar">
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead></TableHead>
                <TableHead className="text-center">{t("dayHours")}</TableHead>
                <TableHead className="text-center">{t("nightHours")}</TableHead>
                <TableHead></TableHead>
                <TableHead className="text-center">{t("bonus")}</TableHead>
                <TableHead className="text-center">{t("penalty")}</TableHead>
                <TableHead colSpan={2} className="text-center">
                  action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} className="hover:text-rd hover:bg-accent">
                  <TableCell>{row.date}</TableCell>
                  <TableCell className="sticky left-0 bg-background/90 md:bg-inherit z-20">
                    {row.name}
                  </TableCell>
                  <TableCell className="text-center">{row.dayHours}</TableCell>
                  <TableCell className="text-center">
                    {row.nightHours}
                  </TableCell>
                  <TableCell>{row.reason}</TableCell>
                  <TableCell className="text-center">{row.bonus}</TableCell>
                  <TableCell className="text-center">{row.penalty}</TableCell>
                  <TableCell
                    className="text-center cursor-pointer"
                    onClick={() => editRemarks(row.id.toLocaleString())}
                  >
                    <Pencil className="w-4 h-3.5" />
                  </TableCell>
                  <TableCell
                    className="text-center cursor-pointer"
                    onClick={() => deleteRemarks(row.id.toLocaleString())}
                  >
                    <Trash2 className="w-4 h-3.5 text-rd" />
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
