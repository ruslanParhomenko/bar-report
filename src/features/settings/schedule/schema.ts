import * as yup from "yup";
const shiftsSchema = yup.string().default("").required("Shifts is required");
const rowShiftSchema = yup.object({
  id: yup
    .string()
    .default(() => new Date().toISOString())
    .required("Id is required"),
  number: yup.number().default(1).required("Number is required"),
  dayHours: yup.string().default(""),
  nightHours: yup.string().default(""),
  totalHours: yup.string().default(""),
  employee: yup.string().default("").required("Employee is required"),
  shifts: yup.array().of(shiftsSchema).default([]),
});
export const scheduleSchema = yup.object({
  year: yup
    .string()
    .default(new Date().getFullYear().toString())
    .required("Year is required"),
  month: yup.string().default("").required("Month is required"),
  role: yup.string().default("").required("Role is required"),
  rowShifts: yup.array().of(rowShiftSchema).default([]),
});

export type ScheduleType = yup.InferType<typeof scheduleSchema>;
export const defaultSchedule: ScheduleType = scheduleSchema.getDefault();
