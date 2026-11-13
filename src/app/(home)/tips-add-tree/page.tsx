import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ADMIN, USER } from "@/constants/roles";
import { TipsAddTreePage } from "@/features/tips-add-tree";
import { getTipsAddByYearMonth } from "@/features/tips-add/actions/get-tips-add";
import { authOptions } from "@/lib/auth";
import { MONTHS } from "@/utils/get-month-days";
import { getServerSession } from "next-auth";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year, day } = await searchParams;

  if (!month || !year || !day) {
    return null;
  }

  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === ADMIN;
  const isCCTV = session?.user?.role === USER;

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
        (isCCTV && requestedMonth === currentMonth - 1));

    if (!isCurrentYearOrNext) {
      return <InsufficientRights />;
    }
  }

  const tipsAdd = await getTipsAddByYearMonth(year, month);

  const tipsForDay = tipsAdd?.find((tip) => tip.id === day) ?? null;

  return <TipsAddTreePage data={tipsForDay} isAdmin={isAdmin} />;
}
