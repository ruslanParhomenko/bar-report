export type OrdersDataForm = {
  tab: string;
  year: string;
  month: string;
  day: string;
  orders: Record<string, Record<string, string>>;
};

export type GetOrdersData = {
  id: string;
  orders: Record<string, Record<string, string>>;
};

export type FormDataOrders = Record<string, Record<string, string>>;
