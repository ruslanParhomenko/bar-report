import { PenaltyTableProps } from "./TableDetails";
import { isValid } from "date-fns";
import { RemarksData } from "@/app/actions/remarks/remarksAction";
import TableGeneral from "./TableGeneral";
import TableDetails from "./TableDetails";

export const PagePenalty = ({
  data,
  tab,
}: {
  data: RemarksData[];
  tab: string;
}) => {
  console.log("data in PagePenalty:", data);
  const filteredRows = data?.flatMap((report) => {
    const date = new Date(report.date);
    if (!isValid(date)) return [];

    const formattedDate = date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return (report.remarks ?? []).map(
      (r): Omit<PenaltyTableProps, "reportId"> => ({
        date: formattedDate,
        name: r.name,
        dayHours: r.dayHours,
        nightHours: r.nightHours,
        reason: r.reason,
        penalty: r.penalty,
        bonus: r.bonus,
        month: date.getMonth().toString(),
        id: report.id,
      })
    );
  });

  if (tab === "general") {
    return <TableGeneral data={filteredRows ?? []} />;
  } else if (tab === "details") {
    return <TableDetails data={filteredRows ?? []} />;
  } else {
    return null;
  }
};
