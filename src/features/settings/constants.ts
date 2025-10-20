export const ROLES = ["ADMIN", "BAR", "CUCINA", "USER", "MNGR"];

export const EMPLOYEES_ROLE = [
  "barmen",
  "waiters",
  "cook",
  "mngr",
  "dish",
  "buyer",
];

//create shedule

export const WAITER_EMPLOYEES = ["waiters"];
export const SHIFT_OPTIONS = ["8", "9", "14", "18", "19", "20"];
export const SHIFT_HOURS_MAP_DAY: Record<string, number> = {
  "8": 12,
  "9": 12,
  "14": 8,
  "18": 4,
  "19": 4,
  "20": 4,
};

export const SHIFT_HOURS_MAP_NIGHT: Record<string, number> = {
  "8": 0,
  "9": 0,
  "14": 4,
  "18": 8,
  "19": 8,
  "20": 8,
};
