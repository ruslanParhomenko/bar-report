import z from "zod";

export const itemFinCashSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const finCashSchema = z.object({
  rowFinCashMonth: z.record(z.string(), z.array(itemFinCashSchema)),
});

export type FinCashForm = z.infer<typeof finCashSchema>;
export const defaultFinCashForm: FinCashForm = {
  rowFinCashMonth: {},
};
