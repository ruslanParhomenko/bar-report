import { MONTHS } from "@/utils/getMonthDays";
import * as yup from "yup";

const dayValueSchema = yup.string().default("");

export const rowCashSchema = yup.object({
  tipsByDay: yup.array().of(dayValueSchema).default([]),
  chipsByDay: yup.array().of(dayValueSchema).default([]),
  visaCasinoByDay: yup.array().of(dayValueSchema).default([]),
  cashBarByDay: yup.array().of(dayValueSchema).default([]),
  visaBarByDay: yup.array().of(dayValueSchema).default([]),
  banquetBarByDay: yup.array().of(dayValueSchema).default([]),
  visaCasinoBarByDay: yup.array().of(dayValueSchema).default([]),
  cash: yup.array().of(dayValueSchema).default([]),

  visaTerminalByDay: yup.array().of(dayValueSchema).default([]),
  nbmPayByDay: yup.array().of(dayValueSchema).default([]),
  bankCollectionByDay: yup.array().of(dayValueSchema).default([]),
  nbmCollectionByDay: yup.array().of(dayValueSchema).default([]),
});

export type RowCashType = yup.InferType<typeof rowCashSchema>;

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
  start_241: yup.string().default(""),
  ao_532: yup.string().default(""),
  z_531: yup.string().default(""),
  final_241: yup.string().default(""),
});

export type CashFormType = yup.InferType<typeof cashSchema>;
export const defaultCashForm: CashFormType = cashSchema.getDefault();
