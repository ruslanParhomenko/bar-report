import { z } from "zod";
const tipsByDaySchema = z.string().regex(/^\d*$/, "только цифры");

export const rowEmployeesTipsSchema = z.object({
  id: z.string().default(""),
  employee: z.string().default(""),
  role: z.string().default(""),
  tipsByDay: z.array(tipsByDaySchema),
});

export type RowEmployeesTipsType = z.infer<typeof rowEmployeesTipsSchema>;

export const tipsSchema = z.object({
  id: z.string().optional(),
  rowEmployeesTips: z.array(rowEmployeesTipsSchema).default([]),
  waitersDishBid: z.string().default("0.03"),
  barmenDishBid: z.string().default("0.07"),
  dishDishBid: z.string().default("0.07"),
  percentTips: z.string().default("0.28"),
  percentBarmen: z.string().default("0.6"),
  percentDish: z.string().default("0.4"),
});

export type TipsFormType = z.infer<typeof tipsSchema>;

export const defaultTipsForm: TipsFormType = tipsSchema.parse({});
