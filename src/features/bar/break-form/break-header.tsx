import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { TIME_LABELS } from "./constant";
import DatePickerInput from "@/components/inputs-form/date-input";
import { RefreshCcw } from "lucide-react";
import { revalidateNav } from "@/app/actions/revalidate-tag/revalidate-teg";
import { BAR_REALTIME_ACTION_TAG } from "@/constants/action-tag";

const currentHour = new Date().getHours();
export default function BreakTableHeader() {
  const resetData = () => {
    revalidateNav(BAR_REALTIME_ACTION_TAG);
  };
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-9">
          <button
            type="button"
            onClick={resetData}
            className="hover:text-black hover:bg-transparent cursor-pointer flex items-center justify-center md:w-10 w-8 h-8 order-1 md:order-2"
          >
            <RefreshCcw className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </TableHead>
        <TableHead className="w-30">
          <DatePickerInput
            fieldName="date"
            className="text-sm text-rd h-5!"
            // disabled
          />
        </TableHead>
        <TableHead className="w-6 " />

        {TIME_LABELS.map((h, i) => {
          const isCurrentHour = Number(h === "24" ? "0" : h) === currentHour;
          return (
            <TableHead
              key={i}
              className={cn(
                "text-center text-md w-11",
                isCurrentHour ? "text-rd font-bold text-lg" : "text-bl",
              )}
            >
              {h}:
            </TableHead>
          );
        })}
        <TableHead className="w-8" />
      </TableRow>
    </TableHeader>
  );
}
