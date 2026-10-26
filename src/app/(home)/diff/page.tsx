import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ADMIN, USER } from "@/constants/roles";
import { DiffPage } from "@/features/diff";
import { getRemarksByYearMonth } from "@/features/penalty/actions/get-penalty";
import { getScheduleByYearAndMonth } from "@/features/schedule/schedule-edit/actions/get-schedule";
import { getTipsAddByYearMonth } from "@/features/tips-add/actions/get-tips-add";
import { authOptions } from "@/lib/auth";
import { MONTHS } from "@/utils/get-month-days";
import { getServerSession } from "next-auth";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const { month, year } = params;
  if (!month || !year) return null;

  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === ADMIN;
  const isCCTV = session?.user?.role === USER;

  if (!isAdmin && !isCCTV) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const requestedYear = parseInt(year);
    const requestedMonth = MONTHS.indexOf(month) + 1;

    const isCurrentYearOrNext =
      requestedYear === currentYear &&
      (requestedMonth === currentMonth || requestedMonth === currentMonth + 1);

    if (!isCurrentYearOrNext) {
      return <InsufficientRights />;
    }
  }

  const [dataRemarks, tipsAdd, dataScheduleBarByMonth] =
    await Promise.allSettled([
      getRemarksByYearMonth(year, month),
      getTipsAddByYearMonth(year, month),
      getScheduleByYearAndMonth(year, month),
    ]);
  return (
    <DiffPage
      archiveData={{
        penalty: dataRemarks.status === "fulfilled" ? dataRemarks.value : null,
        tips: tipsAdd.status === "fulfilled" ? tipsAdd.value : null,
        schedule:
          dataScheduleBarByMonth.status === "fulfilled"
            ? (dataScheduleBarByMonth.value?.find(
                (item) => item.id === "bar",
              ) ?? null)
            : null,
      }}
    />
  );
}
