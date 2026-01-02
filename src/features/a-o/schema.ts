import { MONTHS } from "@/utils/getMonthDays";
import * as yup from "yup";

const dayValueSchema = yup.string().default("");

export const rowAOSchema = yup.object({
  advanceModaByDay: yup.array().of(dayValueSchema).default([]),
  advanceNBMByDay: yup.array().of(dayValueSchema).default([]),

  purchaseModaByDay: yup.array().of(dayValueSchema).default([]),
  ttnModaByDay: yup.array().of(dayValueSchema).default([]),
  nameTtnModaByDay: yup.array().of(dayValueSchema).default([]),

  fuelNBMByDay: yup.array().of(dayValueSchema).default([]),
  purchaseNBMByDay: yup.array().of(dayValueSchema).default([]),
  ttnNBMByDay: yup.array().of(dayValueSchema).default([]),
  nameTtnNBMByDay: yup.array().of(dayValueSchema).default([]),

  purchaseBarByDay: yup.array().of(dayValueSchema).default([]),
  ttnBarByDay: yup.array().of(dayValueSchema).default([]),
  nameTtnBarByDay: yup.array().of(dayValueSchema).default([]),
});

export type RowAOType = yup.InferType<typeof rowAOSchema>;

export const aoSchema = yup.object({
  year: yup
    .string()
    .default(new Date().getFullYear().toString())
    .required("Year is required"),
  month: yup
    .string()
    .default(MONTHS[new Date().getMonth()])
    .required("Month is required"),
  rowAOData: yup
    .object({
      ...rowAOSchema.fields,
    })
    .default(rowAOSchema.getDefault()),
});

export type AOFormType = yup.InferType<typeof aoSchema>;
export const defaultAOForm: AOFormType = aoSchema.getDefault();
