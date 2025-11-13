import * as yup from "yup";

const shiftsSchema = yup.string().default("");

const rowShiftSchema = yup.object({
  id: yup.string().default("").required("Id is required"),
  dayHours: yup.string().default(""),
  nightHours: yup.string().default(""),
  totalHours: yup.string().default(""),
  employee: yup.string().default("").required("Employee is required"),
  role: yup.string().default("").required("Role is required"),
  rate: yup.string().default("").required("Rate is required"),
  employeeId: yup.string().default("").required("EmployeeId is required"),
  shifts: yup.array().of(shiftsSchema).default([]),
});

export type RowShiftType = yup.InferType<typeof rowShiftSchema>;
export const defaultRowShift: RowShiftType = rowShiftSchema.getDefault();

export const scheduleSchema = yup.object({
  year: yup.string().default(""),
  month: yup.string().default(""),
  role: yup.string().default(""),
  rowShifts: yup.array().of(rowShiftSchema).default([]),
});

export type ScheduleType = yup.InferType<typeof scheduleSchema>;
export const defaultSchedule: ScheduleType = scheduleSchema.getDefault();
