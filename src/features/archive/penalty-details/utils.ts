import { RemarksData } from "@/app/actions/remarks/remarks-action";

type GroupedData = {
  dayHours: number;
  nightHours: number;
  bonus: number;
  penalty: number;
};

export function remarksByUniqueEmployee(data: RemarksData[]) {
  const grouped: Record<string, GroupedData> = {};
  data
    ?.flatMap((r) => r.remarks)
    .forEach((item) => {
      if (!item.name) return;

      const name = item.name.trim();
      const day = Number(item.dayHours) || 0;
      const night = Number(item.nightHours) || 0;
      const bonus = Number(item.bonus) || 0;
      const penalty = Number(item.penalty) || 0;

      if (!grouped[name]) {
        grouped[name] = { dayHours: 0, nightHours: 0, bonus: 0, penalty: 0 };
      }

      grouped[name].dayHours += day;
      grouped[name].nightHours += night;
      grouped[name].bonus += bonus;
      grouped[name].penalty += penalty;
    });

  const formattedData = Object.entries(grouped).map(([name, sums]) => ({
    name,
    ...sums,
  }));

  const totalBonus = formattedData.reduce((acc, r) => acc + (r.bonus || 0), 0);
  const totalPenalty = formattedData.reduce(
    (acc, r) => acc + (r.penalty || 0),
    0,
  );

  return { formattedData, totalBonus, totalPenalty };
}
