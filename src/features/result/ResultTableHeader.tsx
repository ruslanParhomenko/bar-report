import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslations } from "next-intl";

export default function ResultTableHeader() {
  const t = useTranslations("Home");
  const classNameRow = "text-center text-gr";
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="md:w-40"></TableHead>
        <TableHead className={classNameRow}>{t("rate")}</TableHead>
        <TableHead className={classNameRow}>{t("tips")}</TableHead>
        <TableHead className={classNameRow}>{t("penalty")}</TableHead>
        <TableHead className={classNameRow}>{t("bonus")}</TableHead>
        <TableHead className="md:w-2/10"></TableHead>
        <TableHead className={classNameRow}>{t("dayHours")}</TableHead>
        <TableHead className={classNameRow}>{t("nightHours")}</TableHead>
        <TableHead className={classNameRow}></TableHead>
        <TableHead className={classNameRow}>salary</TableHead>
        <TableHead className={classNameRow}>{t("total")}</TableHead>
      </TableRow>
    </TableHeader>
  );
}
