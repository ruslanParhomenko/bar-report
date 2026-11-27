export type AmountEmployee = {
  value: string;
  typeAmount: "mdl" | "chips";
};
export type TipsAddDayEmployees = {
  amount: AmountEmployee[];
  employeeName: string;
  idEmployee: string;
  resultAmount: string;
  role: "waiters" | "barmen";
};
type GetTipsAddYear = {
  id: string;
  currency: string;
  tipsAdd: TipsAddDayEmployees[];
};
export type GetTipsAddYearEmployee = {
  id: string;
  tipsAdd: GetTipsAddYear[];
};
