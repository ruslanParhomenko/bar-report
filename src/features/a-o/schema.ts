import { z } from "zod";

const dayValueSchema = z.string().default("");

export const rowAOSchema = z.array(dayValueSchema).default([]);
export const aoSchema = z.object({
  uniqueKey: z.string().default(""),
  year: z.string().default(new Date().getFullYear().toString()),
  month: z.string().default((new Date().getMonth() + 1).toString()),
  rowAOData: z.record(z.string(), rowAOSchema).default({}),
});

export type AOFormTypeInput = z.input<typeof aoSchema>;
export const defaultAOForm = aoSchema.parse({});
