import { z } from "zod";

const shiftsSchema = z.string().default("");

export const rowShiftSchema = z.object({
  id: z.string().min(1, { message: "Id is required" }).default(""),
  dayHours: z.string().default(""),
  nightHours: z.string().default(""),
  totalHours: z.string().default(""),
  employee: z.string().min(1, { message: "Employee is required" }).default(""),
  role: z.string().min(1, { message: "Role is required" }).default(""),
  rate: z.string().min(1, { message: "Rate is required" }).default(""),
  employeeId: z
    .string()
    .min(1, { message: "EmployeeId is required" })
    .default(""),
  shifts: z.array(shiftsSchema).default([]),
});

export type RowShiftType = z.infer<typeof rowShiftSchema>;

export const defaultRowShift: RowShiftType = rowShiftSchema.parse({});

export const scheduleSchema = z.object({
  year: z.string().default(""),
  month: z.string().default(""),
  role: z.string().default(""),
  rowShifts: z.array(rowShiftSchema).default([]),
});

export type ScheduleType = z.infer<typeof scheduleSchema>;

export const defaultSchedule: ScheduleType = scheduleSchema.parse({});
