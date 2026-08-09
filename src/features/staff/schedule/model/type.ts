import { ScheduleType } from "./schema";

export type ScheduleDataForm = {
  year: string;
  month: string;
  role: string;
  rowShifts: ScheduleType["rowShifts"];
};

export type GetScheduleData = {
  id: string;
  rowShifts: ScheduleType["rowShifts"];
};



export type ShiftCounts = Record<string, number[]>;
