"use client";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export default function ResultTableHeader() {
  const classNameRow = "text-center text-gr md:w-10 w-7";

  const isMobile = useIsMobile();
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-18 md:w-26" />
        <TableHead className={cn(classNameRow)} />
        <TableHead className={classNameRow}>d</TableHead>
        <TableHead className={classNameRow}>n</TableHead>
        <TableHead className={classNameRow} />
        <TableHead className={cn(classNameRow, "w-12 md:w-60")} />
        <TableHead className={classNameRow}>tips</TableHead>
        <TableHead className={classNameRow}>-</TableHead>
        <TableHead className={cn(classNameRow)}>+</TableHead>
        {!isMobile && <TableHead className="md:w-20"></TableHead>}
        <TableHead className={cn(classNameRow, "w-12 md:w-30")} />
      </TableRow>
    </TableHeader>
  );
}
