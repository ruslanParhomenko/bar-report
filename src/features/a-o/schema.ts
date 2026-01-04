import { MONTHS } from "@/utils/getMonthDays";
import * as yup from "yup";

const dayValueSchema = yup.string().default("");

export const rowAOSchema = yup
  .object({
    advanceModaByDay: yup.array().of(dayValueSchema).default([]).defined(),
    advanceNBMByDay: yup.array().of(dayValueSchema).default([]).defined(),

    purchaseModaByDay: yup.array().of(dayValueSchema).default([]).defined(),
    ttnModaByDay: yup.array().of(dayValueSchema).default([]).defined(),
    nameTtnModaByDay: yup.array().of(dayValueSchema).default([]).defined(),

    fuelNBMByDay: yup.array().of(dayValueSchema).default([]).defined(),
    purchaseNBMByDay: yup.array().of(dayValueSchema).default([]).defined(),
    ttnNBMByDay: yup.array().of(dayValueSchema).default([]).defined(),
    nameTtnNBMByDay: yup.array().of(dayValueSchema).default([]).defined(),

    purchaseBarByDay: yup.array().of(dayValueSchema).default([]).defined(),
    ttnBarByDay: yup.array().of(dayValueSchema).default([]).defined(),
    nameTtnBarByDay: yup.array().of(dayValueSchema).default([]).defined(),
  })
  .defined();

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
  rowAOData: rowAOSchema.defined(),
});

export type AOFormType = yup.InferType<typeof aoSchema>;
export const defaultAOForm: AOFormType = aoSchema.getDefault();
