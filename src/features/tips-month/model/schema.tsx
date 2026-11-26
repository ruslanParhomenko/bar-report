import { z } from "zod";
const tipsByDaySchema = z.string().regex(/^\d*$/, "только цифры");

export const rowEmployeesTipsSchema = z.object({
  id: z.string(),
  employee: z.string(),
  role: z.string(),
  tipsByDay: z.array(tipsByDaySchema),
});

export const tipsCashByDaySchema = z.string().regex(/^\d*$/, "только цифры");

export type RowEmployeesTipsType = z.infer<typeof rowEmployeesTipsSchema>;

export const tipsSchema = z.object({
  rowEmployeesTips: z.array(rowEmployeesTipsSchema),
  rowCashTips: z.array(tipsCashByDaySchema),
  waitersDishBid: z.string(),
  barmenDishBid: z.string(),
  dishDishBid: z.string(),
  percentTips: z.string(),
  percentBarmen: z.string(),
  percentDish: z.string(),
});

export type TipsForm = z.infer<typeof tipsSchema>;

export const defaultTipsForm: TipsForm = {
  rowEmployeesTips: [],
  rowCashTips: [],
  waitersDishBid: "0.03",
  barmenDishBid: "0.07",
  dishDishBid: "0.07",
  percentTips: "0.28",
  percentBarmen: "0.6",
  percentDish: "0.4",
};
