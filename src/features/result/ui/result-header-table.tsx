"use client";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ResultTableHeader({ month }: { month: string }) {
  const isMobile = useIsMobile();

  return (
    <TableHeader>
      <TableRow className="border-0!">
        <TableHead
          colSpan={10}
          className="text-rd text-center font-bold tracking-wider"
        >
          {month}
        </TableHead>
      </TableRow>
      <TableRow className="h-12 [&>th]:text-center [&>th]:text-[10px] md:[&>th]:w-28 md:[&>th]:text-xs">
        <TableHead>name</TableHead>
        <TableHead className="border-x">salary</TableHead>
        <TableHead className="text-gn">tips</TableHead>
        <TableHead className="text-rd">{isMobile ? "-" : "penalty"}</TableHead>
        <TableHead className="text-bl">{isMobile ? "-" : "bonus"}</TableHead>
        <TableHead className="border-x">{isMobile ? "r" : "rate"}</TableHead>

        <TableHead>hours</TableHead>
        <TableHead className="border-l">total</TableHead>
      </TableRow>
    </TableHeader>
  );
}
