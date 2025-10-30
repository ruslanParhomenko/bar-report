import * as yup from "yup";

const tipsByDaySchema = yup.string().default("");

const rowEmployeesTipsSchema = yup.object({
  id: yup.string().default("").required("Id is required"),
  employee: yup.string().default("").required("Employee is required"),
  role: yup.string().default(""),
  rate: yup.string().default("").required("Rate is required"),
  tips: yup.string().default(""),
  employeeId: yup.string().default("").required("EmployeeId is required"),
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
  month: yup.string().default("").required("Month is required"),
  rowEmployeesTips: yup.array().of(rowEmployeesTipsSchema).default([]),
});

export type TipsFormType = yup.InferType<typeof tipsSchema>;
export const defaultTipsForm: TipsFormType = tipsSchema.getDefault();
