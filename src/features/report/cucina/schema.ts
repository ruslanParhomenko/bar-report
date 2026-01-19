import { z } from "zod";

// --- shifts
export const schemaShift = z.object({
  employees: z.string().default(""),
  time: z.string().default(""),
  over: z.string().default(""),
});
export type ReportShiftType = z.infer<typeof schemaShift>;
export const defaultShift: ReportShiftType = schemaShift.parse({});

// --- prepared products
export const productPreparedSchema = z.object({
  product: z.string().default(""),
  portions: z.string().default(""),
  weight: z.string().default(""),
  time: z.string().default(""),
});
export type ProductPreparedType = z.infer<typeof productPreparedSchema>;
export const productPreparedDefault: ProductPreparedType =
  productPreparedSchema.parse({});

// --- write off
export const writeOffSchema = z.object({
  product: z.string().default(""),
  weight: z.string().default(""),
  reason: z.string().default(""),
});
export type ReportWriteOffType = z.infer<typeof writeOffSchema>;
export const defaultWriteOff: ReportWriteOffType = writeOffSchema.parse({});

// --- main form schema
export const schemaReportCucina = z.object({
  date: z.coerce.date().default(() => new Date()),
  shifts: z.array(schemaShift).default([defaultShift]),
  remains: z.array(productPreparedSchema).default([productPreparedDefault]),
  preparedSalads: z
    .array(productPreparedSchema)
    .default([productPreparedDefault]),
  preparedSeconds: z
    .array(productPreparedSchema)
    .default([productPreparedDefault]),
  preparedDesserts: z
    .array(productPreparedSchema)
    .default([productPreparedDefault]),
  cutting: z.array(productPreparedSchema).default([productPreparedDefault]),
  staff: z.array(productPreparedSchema).default([productPreparedDefault]),
  writeOff: z.array(writeOffSchema).default([defaultWriteOff]),
  notes: z.string().default(""),
});

export type ReportCucinaType = z.infer<typeof schemaReportCucina>;
export type ReportCucinaFormInput = z.input<typeof schemaReportCucina>;
export const defaultReportCucina: ReportCucinaType = schemaReportCucina.parse(
  {},
);
