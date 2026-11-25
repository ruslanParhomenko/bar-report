import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ADMIN } from "@/constants/roles";
import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { TipsPage } from "@/features/staff/tips";
import { getTipsByYear } from "@/features/staff/tips/actions/get-tips";
import { getTipsAddByYearMonth } from "@/features/tips-add/actions/get-tips-add";
import { authOptions } from "@/lib/auth";
import { MONTHS } from "@/utils/get-month-days";
import { getServerSession } from "next-auth";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { year, month } = await searchParams;
  if (!year || !month) return null;
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === ADMIN;

  if (!isAdmin) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const requestedYear = parseInt(year);
    const requestedMonth = MONTHS.indexOf(month) + 1;

    const isCurrentYearOrNext =
      requestedYear === currentYear &&
      (requestedMonth === currentMonth ||
        requestedMonth === currentMonth + 1 ||
        requestedMonth === currentMonth - 1);

    if (!isCurrentYearOrNext) {
      return <InsufficientRights />;
    }
  }

  const [dataTipsYear, employees, dataTipsAdd] = await Promise.allSettled([
    getTipsByYear(year),
    getEmployees(),
    getTipsAddByYearMonth(year, month),
  ]);

  return (
    <TipsPage
      dataTipsAdd={
        dataTipsAdd.status === "fulfilled" ? dataTipsAdd.value : null
      }
      dataTipsYear={
        dataTipsYear.status === "fulfilled" ? dataTipsYear.value : null
      }
      employees={employees.status === "fulfilled" ? employees.value : null}
    />
  );
}
