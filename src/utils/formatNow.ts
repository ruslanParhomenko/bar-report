import { format, isValid } from "date-fns";

export const formatNow = (): string => {
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const formatNowData = (): string => {
  const now = new Date();

  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");

  return `${day}.${month} ${hours}:${minutes}`;
};

export const formatDataForInput = ({ date }: { date: Date }): string => {
  const formatDate =
    date && isValid(new Date(date)) ? format(new Date(date), "dd.MM.yy") : "-";

  return formatDate;
};
