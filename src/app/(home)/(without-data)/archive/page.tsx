import { getReportsBar } from "@/app/actions/archive/reportBarAction";
import { getReportsCucina } from "@/app/actions/archive/reportCucinaAction";
import {
  REPORT_BAR_ENDPOINT,
  REPORT_CUCINA_ENDPOINT,
} from "@/constants/endpoint-tag";
import { ArchivePage } from "@/features/archive/ArchiveForm";

const DATA_BY_PARAMS = {
  [REPORT_BAR_ENDPOINT]: getReportsBar,
  [REPORT_CUCINA_ENDPOINT]: getReportsCucina,
} as const;

type DataParam = keyof typeof DATA_BY_PARAMS;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const type = (await searchParams)?.data;

  if (!type || !((type as string) in DATA_BY_PARAMS)) {
    return <ArchivePage type={null} data={[]} />;
  }

  const key = type as DataParam;

  const data = await DATA_BY_PARAMS[key]();

  return <ArchivePage type={key} data={data} />;
}
