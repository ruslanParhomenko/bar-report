import { getCashFormById } from "@/app/actions/cash/cashAction";
import { getEmployees } from "@/app/actions/employees/employeeAction";
import { getTipsFormById } from "@/app/actions/tips/tipsAction";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import TipsForm from "@/features/tips/tips-form";
import { checkAccess } from "@/lib/check-access";
import { getMonthDays, MONTHS } from "@/utils/getMonthDays";

const SET_ACCESS = ["ADMIN", "MNGR"];
const SELECTED_ROLE = ["waiters", "barmen"] as const;
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const { month, year } = await searchParams;
  const setMonth = month ?? MONTHS[new Date().getMonth()];
  const setYear = year ?? new Date().getFullYear().toString();
  const uniqueKey = `${setYear}-${setMonth}`;

  const monthDays = getMonthDays({ month: setMonth, year: setYear });

  const [dataTips, dataCash, employees] = await Promise.all([
    getTipsFormById(uniqueKey),
    getCashFormById(uniqueKey),
    (await getEmployees()).filter((e) =>
      SELECTED_ROLE.includes(e.role as (typeof SELECTED_ROLE)[number]),
    ),
  ]);
  return (
    <TipsForm
      dataTips={dataTips}
      dataCash={dataCash}
      month={setMonth}
      year={setYear}
      employees={employees}
      monthDays={monthDays}
    />
  );
}
