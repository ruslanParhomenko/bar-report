import { MONTHS } from "@/utils/getMonthDays";
import * as yup from "yup";

const dayValueSchema = yup.string().default("");

export const rowCashSchema = yup.object({
  tipsByDay: yup.array().of(dayValueSchema).default([]),
  chipsByDay: yup.array().of(dayValueSchema).default([]),
  differenceByDay: yup.array().of(dayValueSchema).default([]),
  visaCasinoByDay: yup.array().of(dayValueSchema).default([]),
});

export const cashSchema = yup.object({
  year: yup
    .string()
    .default(new Date().getFullYear().toString())
    .required("Year is required"),
  month: yup
    .string()
    .default(MONTHS[new Date().getMonth()])
    .required("Month is required"),
  rowCashData: yup
    .object({
      ...rowCashSchema.fields,
    })
    .default(rowCashSchema.getDefault()),
});

export type CashFormType = yup.InferType<typeof cashSchema>;
export const defaultCashForm: CashFormType = cashSchema.getDefault();
