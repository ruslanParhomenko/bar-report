import SelectDay from "@/components/select/select-day";
import SelectOptions from "@/components/select/select-options";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PenaltyDetailsHeader({
  options,
  value,
  setValue,
  selectedDay,
  setSelectedDay,
  monthDays,
}: {
  options: { value: string; label: string }[];
  value: string;
  setValue: (value: string) => void;
  selectedDay: string;
  setSelectedDay: (value: string) => void;
  monthDays: { day: number; weekday: string }[];
}) {
  return (
    <TableHeader className="bg-background sticky top-0 z-40">
      <TableRow className="[&>th]:text-gr [&>th]:h-7! [&>th]:py-0! [&>th]:text-xs">
        <TableHead className="w-10 px-0">
          <SelectDay
            value={selectedDay}
            onChange={setSelectedDay}
            monthDays={monthDays}
            className="w-8 bg-transparent!"
          />
        </TableHead>
        <TableHead className="sticky left-0 w-40">
          <SelectOptions
            options={options}
            value={value}
            onChange={setValue}
            className="h-5! bg-transparent!"
          />
        </TableHead>
        <TableHead className="w-20 text-center">day</TableHead>
        <TableHead className="w-20 text-center">night</TableHead>
        <TableHead className="w-full">reason</TableHead>
        <TableHead className="w-30 text-center">bonus</TableHead>
        <TableHead className="w-30 text-center">penalty</TableHead>
      </TableRow>
    </TableHeader>
  );
}
