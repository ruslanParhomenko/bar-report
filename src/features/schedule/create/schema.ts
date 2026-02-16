import { z } from "zod";

const shiftsSchema = z.string();

export const rowShiftSchema = z.object({
  id: z.string().min(1),
  dayHours: z.string(),
  nightHours: z.string(),
  totalHours: z.string(),
  employee: z.string(),
  role: z.string(),
  rate: z.string(),
  employeeId: z.string(),
  shifts: z.array(shiftsSchema),
});

export type RowShiftType = z.infer<typeof rowShiftSchema>;

export const defaultRowShift = {
  id: "",
  dayHours: "",
  nightHours: "",
  totalHours: "",
  employee: "",
  role: "",
  rate: "",
  employeeId: "",
  shifts: [],
};

export const scheduleSchema = z.object({
  year: z.string(),
  month: z.string(),
  role: z.string(),
  rowShifts: z.array(rowShiftSchema),
});

export type ScheduleType = z.infer<typeof scheduleSchema>;

export const defaultSchedule = {
  year: "",
  month: "",
  role: "",
  rowShifts: [],
};
