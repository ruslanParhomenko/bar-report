import { MONTHS } from "@/utils/getMonthDays";
import { ro } from "date-fns/locale";
import * as yup from "yup";

const tipsByDaySchema = yup.string().default("");

const rowEmployeesTipsSchema = yup.object({
  id: yup.string().default("").required("Id is required"),
  employee: yup.string().default("").required("Employee is required"),
  role: yup.string().default(""),
  tips: yup.string().default(""),
  tipsByDay: yup.array().of(tipsByDaySchema).default([]),
});

export type RowEmployeesTipsType = yup.InferType<typeof rowEmployeesTipsSchema>;
export const defaultRowEmployeesTips: RowEmployeesTipsType =
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
  cashTips: yup.array().of(tipsByDaySchema).default([]),
  waitersDishBid: yup
    .string()
    .default("0.03")
    .required("WaitersDishBid is required"),
  barmenDishBid: yup
    .string()
    .default("0.07")
    .required("BarmenDishBid is required"),
  dishDishBid: yup.string().default("0.07").required("DishDishBid is required"),
  percentTips: yup.string().default("0.28").required("PercentTips is required"),
});

export type TipsFormType = yup.InferType<typeof tipsSchema>;
export const defaultTipsForm: TipsFormType = tipsSchema.getDefault();
