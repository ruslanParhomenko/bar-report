import { z } from "zod";

// --- shifts
export const shiftSchema = z.object({
  employees: z.string(),
  time: z.string(),
  over: z.string(),
});
export type ReportShiftType = z.infer<typeof shiftSchema>;
export const shiftDefault = {
  employees: "",
  time: "",
  over: "",
};

// --- prepared products
export const productPreparedSchema = z.object({
  product: z.string(),
  weight: z.string(),
  time: z.string(),
});
export type ProductPreparedType = z.infer<typeof productPreparedSchema>;
export const productPreparedDefault = {
  product: "",
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
export const writeOffDefault = {
  product: "",
  weight: "",
  reason: "",
};

// --- main form schema
export const schemaReportCucina = z.object({
  date: z.string(),

  shifts: z.array(shiftSchema),
  preparedFirst: z.array(productPreparedSchema),
  preparedSalads: z.array(productPreparedSchema),
  preparedGarnish: z.array(productPreparedSchema),
  preparedSeconds: z.array(productPreparedSchema),
  preparedDesserts: z.array(productPreparedSchema),
  cutting: z.array(productPreparedSchema),
  staffFurchet: z.array(productPreparedSchema),
  staff: z.array(productPreparedSchema),
  writeOff: z.array(writeOffSchema),
  notes: z.string(),
});

export type ReportKitchenForm = z.infer<typeof schemaReportCucina>;

export const defaultReportCucina = {
  date: new Date().toISOString(),
  shifts: [shiftDefault],
  preparedFirst: [productPreparedDefault],
  preparedSalads: [productPreparedDefault],
  preparedGarnish: [productPreparedDefault],
  preparedSeconds: [productPreparedDefault],
  preparedDesserts: [productPreparedDefault],
  cutting: [productPreparedDefault],
  staff: [productPreparedDefault],
  staffFurchet: [productPreparedDefault],
  writeOff: [writeOffDefault],
  notes: "",
};
