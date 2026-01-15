import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function ResultTableHeader() {
  const t = useTranslations("Home");
  const classNameRow = "text-center text-gr";
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="md:w-30"></TableHead>
        <TableHead className={classNameRow}>{t("rate")}</TableHead>
        <TableHead className={classNameRow}>{t("dayHours")}</TableHead>
        <TableHead className={classNameRow}>{t("nightHours")}</TableHead>
        <TableHead className={classNameRow}></TableHead>
        <TableHead className={cn(classNameRow, "border-r")}>зп</TableHead>{" "}
        <TableHead className={classNameRow}>{t("tips")}</TableHead>
        <TableHead className={classNameRow}>{t("penalty")}</TableHead>
        <TableHead className={cn(classNameRow, "border-r")}>
          {t("bonus")}
        </TableHead>
        <TableHead className={classNameRow}>{t("total")}</TableHead>
      </TableRow>
    </TableHeader>
  );
}
