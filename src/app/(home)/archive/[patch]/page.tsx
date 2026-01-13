import { getReportBarByDate } from "@/app/actions/archive/reportBarAction";
import {
  getReportsCucinaByDate,
  ReportCucinaData,
} from "@/app/actions/archive/reportCucinaAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import ReportBar from "@/features/archive/ReportBar";
import ReportCucina from "@/features/archive/ReportCucina";
import { authOptions } from "@/lib/auth";
import { MONTHS } from "@/utils/getMonthDays";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS_BY_PATCH = {
  bar: ["ADMIN", "BAR", "MNGR", "USER"],
  cucina: ["ADMIN", "CUCINA", "MNGR", "USER"],
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ patch: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const { month, year } = await searchParams;
  const { patch } = await params;
  if (!patch || !month || !year) return null;

  if (
    !SET_ACCESS_BY_PATCH[patch as "bar" | "cucina"].includes(
      session?.user?.role as string
    )
  )
    return <InsufficientRights />;

  const monthNum = Number(MONTHS.indexOf(month) + 1);
  const yearNum = Number(year);

  if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
    throw new Error(`Invalid month/year: ${month}/${year}`);
  }

  //  UTC
  const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1, 0, 0, 0));
  const endDate = new Date(Date.UTC(yearNum, monthNum, 1, 0, 0, 0));

  // get data
  const dataReportBar =
    patch === "bar" &&
    (
      await getReportBarByDate({
        startDate,
        endDate,
      })
    ).reports;
  const dataReportCucina =
    patch === "cucina" &&
    (
      await getReportsCucinaByDate({
        startDate,
        endDate,
      })
    ).reports;

  if (patch === "bar") return <ReportBar data={dataReportBar as any[]} />;
  else if (patch === "cucina")
    return <ReportCucina data={dataReportCucina as ReportCucinaData[]} />;
  else return null;
}
