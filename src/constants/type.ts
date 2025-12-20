import {
  BreakList,
  DailyReportCucina,
  Movement,
  Prepared,
  Remain,
  Remark,
  RemarkReport,
  Row,
  Shift,
  Staff,
  WriteOff,
} from "@/generated/prisma";

export type RemarkData = RemarkReport & { remarks: Remark[] };
export type BreakListData = BreakList & { rows: Row[] };
export type ReportCucinaData = DailyReportCucina & {
  shifts: Shift[];
  remains: Remain[];
  prepared: Prepared[];
  staff: Staff[];
  movement: Movement[];
  writeOff: WriteOff[];
};
