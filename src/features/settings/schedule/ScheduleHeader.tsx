'use client'
import { useEffect } from 'react';
import { TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function ScheduleHeader({
  monthDays
}: {
  monthDays: any[];
}) {


  return (
    <TableHeader>
      <TableRow>
        <TableCell className="w-2 text-start p-0" />
        <TableCell className="w-10" />
        <TableCell className="w-10" />
        <TableCell className="w-33 p-0" />
        <TableCell className="w-2 p-0" />

        {monthDays.map((day, index) => {


          return (
            <TableCell
              key={day.day}
              className={cn(
                "w-10 cursor-pointer p-0"
              )}
            >
              <div className="text-sm font-semibold text-center">{day.day}</div>
              <div className="text-xs text-muted-foreground text-center">
                {day.weekday}
              </div>
            </TableCell>
          );
        })}

        <TableCell className="w-6" />
      </TableRow>
    </TableHeader>
  );
}
