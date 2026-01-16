import { z } from "zod";
import { MONTHS } from "@/utils/getMonthDays";

const tipsByDaySchema = z.string().default("");

export const rowEmployeesTipsSchema = z.object({
  id: z.string().default(""),
  employee: z.string().default(""),
  role: z.string().default(""),
  tips: z.string().default(""),
  tipsByDay: z.array(tipsByDaySchema).default([]),
});

export type RowEmployeesTipsType = z.infer<typeof rowEmployeesTipsSchema>;

export const defaultRowEmployeesTips: RowEmployeesTipsType =
  rowEmployeesTipsSchema.parse({});

export const tipsSchema = z.object({
  id: z.string().optional(),
  year: z.string().default(new Date().getFullYear().toString()),
  month: z.string().default(MONTHS[new Date().getMonth()]),
  rowEmployeesTips: z.array(rowEmployeesTipsSchema).default([]),
  cashTips: z.array(tipsByDaySchema).default([]),
  waitersDishBid: z.string().default("0.03"),
  barmenDishBid: z.string().default("0.07"),
  dishDishBid: z.string().default("0.07"),
  percentTips: z.string().default("0.28"),
  percentBarmen: z.string().default("0.6"),
  percentDish: z.string().default("0.4"),
});

export type TipsFormType = z.infer<typeof tipsSchema>;

export const defaultTipsForm: TipsFormType = tipsSchema.parse({});
