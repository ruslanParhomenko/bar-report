import { BreakForm } from "./schema";

export type BreakDataForm = {
  day: string;
  month: string;
  year: string;
  rows: BreakForm["rows"];
};

export type GetBreakData = {
  id: string;
  rows: BreakForm["rows"];
};