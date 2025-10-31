import { MONTHS } from "@/utils/getMonthDays";
import { ro } from "date-fns/locale";
import * as yup from "yup";

const tipsByDaySchema = yup.string().default("");

const rowEmployeesTipsSchema = yup.object({
  id: yup.string().default("").required("Id is required"),
  employee: yup.string().default("").required("Employee is required"),
  role: yup.string().default(""),
  rate: yup.string().default(""),
  tips: yup.string().default(""),
  employeeId: yup.string().default(""),
  tipsByDay: yup.array().of(tipsByDaySchema).default([]),
});

export type RowEmployeesTipsType = yup.InferType<typeof rowEmployeesTipsSchema>;

const cashTipsSchema = yup.object({
  employee: yup.string().default("cash tips"),
  tips: yup.string().default(""),
  tipsByDay: yup.array().of(tipsByDaySchema).default([]),
});

export type rowEmployeesTipsSchema = yup.InferType<
  typeof rowEmployeesTipsSchema
>;
export const defaultRowEmployeesTips: rowEmployeesTipsSchema =
  rowEmployeesTipsSchema.getDefault();

export const tipsSchema = yup.object({
  id: yup.string().default(undefined),
  year: yup
    .string()
    .default(new Date().getFullYear().toString())
    .required("Year is required"),
  month: yup
    .string()
    .default(MONTHS[new Date().getMonth()])
    .required("Month is required"),
  rowEmployeesTips: yup.array().of(rowEmployeesTipsSchema).default([]),
  cashTips: cashTipsSchema,
});

export type TipsFormType = yup.InferType<typeof tipsSchema>;
export const defaultTipsForm: TipsFormType = tipsSchema.getDefault();
