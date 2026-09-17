import { z } from "zod";
import {
  menuDailyDefaultValues,
  menuDailySchema,
} from "../../menu-daily/model/schema";
import { DAYS } from "../config/constants";

export const menuWeekSchema = z.object(
  Object.fromEntries(DAYS.map((day) => [day, menuDailySchema])),
);

export type MenuWeekForm = z.infer<typeof menuWeekSchema>;

export const menuWeekDefaultValues: MenuWeekForm = Object.fromEntries(
  DAYS.map((day) => [day, menuDailyDefaultValues]),
) as MenuWeekForm;
