import { TableCell, TableHeader, TableRow } from "@/components/ui/table";

export default function SheduleHeader({
  monthDays,
}: {
  monthDays: { day: number; weekday: string }[];
}) {
  console.log("monthDays", monthDays);
  return (
    <TableHeader>
      <TableRow>
        <TableCell className="w-6"></TableCell>
        <TableCell className="w-6"></TableCell>
        <TableCell className="w-6"></TableCell>
        <TableCell className="w-8"></TableCell>
        <TableCell className="w-40"></TableCell>

        {monthDays.map((day) => (
          <TableCell key={day.day} className={"w-7 text-center cursor-pointer"}>
            <div className="text-sm font-semibold">{day.day}</div>
            <div className="text-xs text-muted-foreground">{day.weekday}</div>
          </TableCell>
        ))}
      </TableRow>
    </TableHeader>
  );
}
