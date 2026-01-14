import * as yup from "yup";

export const schemaShift = yup.object({
  employees: yup.string().default(""),
  time: yup.string().default(""),
  over: yup.string().default(""),
});
export type ReportShiftType = yup.InferType<typeof schemaShift>;
export const defaultShift: ReportShiftType = schemaShift.getDefault();

//  prepared

export const productPreparedSchema = yup.object({
  product: yup.string().default(""),
  portions: yup.string().default(""),
  weight: yup.string().default(""),
  time: yup.string().default(""),
});
export type ProductPreparedType = yup.InferType<typeof productPreparedSchema>;
export const productPreparedDefault = productPreparedSchema.getDefault();

// write off
export const writeOffSchema = yup.object({
  product: yup.string().default(""),
  weight: yup.string().default(""),
  reason: yup.string().default(""),
});
export type ReportWriteOffType = yup.InferType<typeof writeOffSchema>;
export const defaultWriteOff: ReportWriteOffType = writeOffSchema.getDefault();

// form schema
export const schemaReportCucina = yup.object({
  date: yup.date().default(new Date()),
  shifts: yup.array(schemaShift).default([defaultShift]),
  remains: yup.array(productPreparedSchema).default([productPreparedDefault]),
  preparedSalads: yup
    .array(productPreparedSchema)
    .default([productPreparedDefault]),
  preparedSeconds: yup
    .array(productPreparedSchema)
    .default([productPreparedDefault]),
  preparedDesserts: yup
    .array(productPreparedSchema)
    .default([productPreparedDefault]),
  cutting: yup.array(productPreparedSchema).default([productPreparedDefault]),
  staff: yup.array(schemaShift).default([defaultShift]),
  writeOff: yup.array(writeOffSchema).default([defaultWriteOff]),
  notes: yup.string().default(""),
});
export type ReportCucinaType = yup.InferType<typeof schemaReportCucina>;
export const defaultReportCucina = schemaReportCucina.getDefault();
