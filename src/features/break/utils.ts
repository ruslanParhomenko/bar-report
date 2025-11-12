import { INTERVAL_00, INTERVAL_20, INTERVAL_40 } from "./constant";

export const isCurrentCell = (time: string, value: string | string[]) => {
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();
  const selectedValue = Array.isArray(value) ? value[0] : value;
  const minuteStr = currentMinute.toLocaleString();

  const isMinuteMatch =
    (INTERVAL_00.includes(minuteStr) && selectedValue === "00") ||
    (INTERVAL_20.includes(minuteStr) && selectedValue === "20") ||
    (INTERVAL_40.includes(minuteStr) && selectedValue === "40");

  return Number(time === "24" ? "0" : time) === currentHour && isMinuteMatch;
};
