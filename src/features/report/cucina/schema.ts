import * as yup from "yup";

export const schemaShift = yup
  .array()
  .of(
    yup.object({
      employees: yup.string().nullable().default(""),
      time: yup.string().nullable().default(""),
      over: yup.string().nullable().default(""),
    })
  )
  .default([{ employees: "", time: "", over: "" }]);

export type ReportShiftType = yup.InferType<typeof schemaShift>;
export const defaultShift: ReportShiftType = schemaShift.getDefault();

//remains
export const remainsSchema = yup
  .array()
  .of(
    yup.object({
      product: yup.string().nullable().default(""),
      portions: yup.string().nullable().default(""),
      weight: yup.string().nullable().default(""),
    })
  )
  .default([{ product: "", portions: "", weight: "" }]);
export type ReportRemainsType = yup.InferType<typeof remainsSchema>;
export const defaultRemains: ReportRemainsType = remainsSchema.getDefault();

//  salat

export const productsSaladSchema = yup
  .array()
  .of(
    yup.object({
      product: yup.string().nullable().default(""),
      portions: yup.string().nullable().default(""),
      weight: yup.string().nullable().default(""),
      time: yup.string().nullable().default(""),
    })
  )
  .default([{ product: "", portions: "", weight: "", time: "" }]);
export type ReportProductsSaladType = yup.InferType<typeof productsSaladSchema>;
export const defaultProductsSalad: ReportProductsSaladType =
  productsSaladSchema.getDefault();

//seconds
export const productsSecondsSchema = yup
  .array()
  .of(
    yup.object({
      product: yup.string().nullable().default(""),
      portions: yup.string().nullable().default(""),
      weight: yup.string().nullable().default(""),
      time: yup.string().nullable().default(""),
    })
  )
  .default([{ product: "", portions: "", weight: "", time: "" }]);
export type ReportProductsSecondsType = yup.InferType<
  typeof productsSecondsSchema
>;
export const defaultProductsSeconds: ReportProductsSecondsType =
  productsSecondsSchema.getDefault();

//deserts
export const productsDessertsSchema = yup
  .array()
  .of(
    yup.object({
      product: yup.string().nullable().default(""),
      portions: yup.string().nullable().default(""),
      weight: yup.string().nullable().default(""),
      time: yup.string().nullable().default(""),
    })
  )
  .default([{ product: "", portions: "", weight: "", time: "" }]);
export type ReportProductsDessertsType = yup.InferType<
  typeof productsDessertsSchema
>;
export const defaultProductsDesserts: ReportProductsDessertsType =
  productsDessertsSchema.getDefault();

//cuting
export const productsCuttingSchema = yup
  .array()
  .of(
    yup.object({
      product: yup.string().nullable().default(""),
      portions: yup.string().nullable().default(""),
      weight: yup.string().nullable().default(""),
      time: yup.string().nullable().default(""),
    })
  )
  .default([{ product: "", portions: "", weight: "", time: "" }]);
export type ReportProductsCuttingType = yup.InferType<
  typeof productsCuttingSchema
>;
export const defaultProductsCutting: ReportProductsCuttingType =
  productsCuttingSchema.getDefault();

// staff

export const staffSchema = yup
  .array()
  .of(
    yup.object({
      product: yup.string().nullable().default(""),
      portions: yup.string().nullable().default(""),
      weight: yup.string().nullable().default(""),
      time: yup.string().nullable().default(""),
    })
  )
  .default([{ product: "", portions: "", weight: "", time: "" }]);
export type ReportStaffType = yup.InferType<typeof staffSchema>;
export const defaultStaff: ReportStaffType = staffSchema.getDefault();

// movement
export const movementSchema = yup
  .array()
  .of(
    yup.object({
      nameOutside: yup.string().nullable().default(""),
      nameInside: yup.string().nullable().default(""),
      weight: yup.string().nullable().default(""),
    })
  )
  .default([{ nameOutside: "", nameInside: "", weight: "" }]);
export type ReportMovementType = yup.InferType<typeof movementSchema>;
export const defaultMovement: ReportMovementType = movementSchema.getDefault();

// write off
export const writeOffSchema = yup
  .array()
  .of(
    yup.object({
      product: yup.string().nullable().default(""),
      weight: yup.string().nullable().default(""),
      reason: yup.string().nullable().default(""),
    })
  )
  .default([{ product: "", weight: "", reason: "" }]);
export type ReportWriteOffType = yup.InferType<typeof writeOffSchema>;
export const defaultWriteOff: ReportWriteOffType = writeOffSchema.getDefault();
// form schema
export const schemaReportCucina = yup.object({
  date: yup.date().default(new Date()),
  shifts: schemaShift,
  remains: remainsSchema,

  preparedSalads: productsSaladSchema,
  preparedSeconds: productsSecondsSchema,
  preparedDesserts: productsDessertsSchema,
  cutting: productsCuttingSchema,
  staff: staffSchema,
  movement: movementSchema,
  writeOff: writeOffSchema,
  notes: yup.string().nullable().default(""),
});
export type ReportCucinaType = yup.InferType<typeof schemaReportCucina>;
export const defaultReportCucina = schemaReportCucina.getDefault();
