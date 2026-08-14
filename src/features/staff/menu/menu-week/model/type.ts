import { MenuDailyItem } from "../../menu-daily/model/schema";
import { SECTIONS } from "../config/constants";

export type MenuWeekFormData = Record<
  (typeof SECTIONS)[number],
  MenuDailyItem[]
>;
