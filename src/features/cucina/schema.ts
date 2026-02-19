import { z } from "zod";

// --- shifts
export const schemaShift = z.object({
  employees: z.string(),
  time: z.string(),
  over: z.string(),
});
export type ReportShiftType = z.infer<typeof schemaShift>;
export const defaultShift = {
  employees: "",
  time: "",
  over: "",
};

// --- prepared products
export const productPreparedSchema = z.object({
  product: z.string(),
  portions: z.string(),
  weight: z.string(),
  time: z.string(),
});
export type ProductPreparedType = z.infer<typeof productPreparedSchema>;
export const productPreparedDefault = {
  product: "",
  portions: "",
  weight: "",
  time: "",
};
// --- write off
export const writeOffSchema = z.object({
  product: z.string(),
  weight: z.string(),
  reason: z.string(),
});
export type ReportWriteOffType = z.infer<typeof writeOffSchema>;
export const defaultWriteOff = {
  product: "",
  weight: "",
  reason: "",
};

// --- main form schema
export const schemaReportCucina = z.object({
  date: z.string(),

  shifts: z.array(schemaShift),
  remains: z.array(productPreparedSchema),
  preparedSalads: z.array(productPreparedSchema),
  preparedSeconds: z.array(productPreparedSchema),
  preparedDesserts: z.array(productPreparedSchema),
  cutting: z.array(productPreparedSchema),
  staff: z.array(productPreparedSchema),
  writeOff: z.array(writeOffSchema),
  notes: z.string(),
});

export type ReportCucinaType = z.output<typeof schemaReportCucina>;

export const defaultReportCucina = {
  date: new Date().toISOString(),
  shifts: [defaultShift],
  remains: [productPreparedDefault],
  preparedSalads: [productPreparedDefault],
  preparedSeconds: [productPreparedDefault],
  preparedDesserts: [productPreparedDefault],
  cutting: [productPreparedDefault],
  staff: [productPreparedDefault],
  writeOff: [defaultWriteOff],
  notes: "",
};
