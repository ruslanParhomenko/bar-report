import SelectOptions from "@/components/select/select-options";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

export default function PenaltyDetailsHeader({
  options,
  value,
  setValue,
  selectedDay,
  setSelectedDay,
  monthDays,
}: {
  options: string[];
  value: string;
  setValue: (value: string) => void;
  selectedDay: number;
  setSelectedDay: (value: number) => void;
  monthDays: { day: number; weekday: string }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <TableHeader className="sticky top-0 bg-background z-40">
      <TableRow className="[&>th]:text-muted-foreground [&>th]:py-0">
        <TableHead className="w-1/8">
          <Select open={open} onOpenChange={setOpen}>
            <SelectTrigger className="w-32 h-8! border-0 shadow-none rounded-md md:text-md text-xs [&>svg]:hidden justify-between bg-background!">
              <span className="text-sm text-rd">{selectedDay}</span>
            </SelectTrigger>

            <SelectContent position="popper" className="p-2">
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: monthDays.length + 1 }, (_, i) => {
                  const day = i;
                  const isSelected = day === selectedDay;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        setSelectedDay(day);
                        setOpen(false); // 🔥 закрытие
                      }}
                      className={[
                        "h-9 w-9 rounded-md text-sm transition",
                        "hover:bg-accent hover:text-accent-foreground",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted",
                      ].join(" ")}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </SelectContent>
          </Select>
        </TableHead>
        <TableHead className="w-1/8">
          <SelectOptions options={options} value={value} setValue={setValue} />
        </TableHead>
        <TableHead className="text-center w-1/8">day</TableHead>
        <TableHead className="text-center w-1/8">night</TableHead>
        <TableHead className="w-3/8">reason</TableHead>
        <TableHead className="text-center w-1/8">bonus</TableHead>
        <TableHead className="text-center w-1/8">penalty</TableHead>
        <TableHead className="text-center w-1/8" />
      </TableRow>
    </TableHeader>
  );
}
