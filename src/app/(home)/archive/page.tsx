import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ADMIN, USER } from "@/constants/roles";
import { ARCHIVE_MAIN_ROUTE } from "@/constants/route-tag";
import ArchivePage from "@/features/archive/archive-page";
import { requireTabAccess } from "@/lib/access";
import { canViewSchedule } from "@/utils/can-access-period";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;

  const { month, year, tab } = params;
  if (!month || !year || !tab) return null;

  const { user } = await requireTabAccess(ARCHIVE_MAIN_ROUTE, tab);

  if (!user) {
    return <InsufficientRights />;
  }
  const isAdmin = user.role === ADMIN;
  const isCCTV = user.role === USER;

  const prevMonths = isCCTV ? 1 : 0;

  if (!canViewSchedule(year, month, prevMonths, 0) && !isAdmin) {
    return <InsufficientRights />;
  }

  return <ArchivePage isAdmin={isAdmin} tab={tab} year={year} month={month} />;
}
