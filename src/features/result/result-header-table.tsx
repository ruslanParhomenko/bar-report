import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function ResultTableHeader() {
  const t = useTranslations("Home");
  const classNameRow = "text-center text-gr w-10";
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="md:w-30"></TableHead>
        <TableHead className={classNameRow} />
        <TableHead className={classNameRow}>d</TableHead>
        <TableHead className={classNameRow}>n</TableHead>
        <TableHead className={classNameRow} />
        <TableHead className={cn(classNameRow, "w-60")} />
        <TableHead className={classNameRow}>tips</TableHead>
        <TableHead className={classNameRow}>-</TableHead>
        <TableHead className={cn(classNameRow)}>+</TableHead>
        <TableHead className={cn(classNameRow, "w-50")} />
      </TableRow>
    </TableHeader>
  );
}
