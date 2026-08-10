import z from "zod";

export const itemFinCashSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const finCashSchema = z.object({
  rowFinCashMonth: z.record(z.string(), z.array(itemFinCashSchema)),
});

export type FinForm = z.infer<typeof finCashSchema>;
export const defaultFinCashForm: FinForm = {
  rowFinCashMonth: {},
};
