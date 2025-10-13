import {
  BreakList,
  CashVerify,
  DailyReport,
  DailyReportCucina,
  Expense,
  Inventory,
  Movement,
  Prepared,
  ProductTransfer,
  Remain,
  Remark,
  RemarkReport,
  Row,
  Shift,
  Staff,
  Tobacco,
  WriteOff,
} from "@/generated/prisma";

export type RemarkData = RemarkReport & { remarks: Remark[] };
export type BreakListData = BreakList & { rows: Row[] };
export type ReportBarData = DailyReport & {
  tobacco: Tobacco[];
  cashVerify: CashVerify[];
  expenses: Expense[];
  productTransfer: ProductTransfer[];
  inventory: Inventory[];
};
export type ReportCucinaData = DailyReportCucina & {
  shifts: Shift[];
  remains: Remain[];
  prepared: Prepared[];
  staff: Staff[];
  movement: Movement[];
  writeOff: WriteOff[];
};

export type ArchiveData = {
  dailyReportCucina: ReportCucinaData[];
  dailyReport: ReportBarData[];
  remarkReport: RemarkData[];
  breakList: BreakListData[];
};
