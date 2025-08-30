import { INITIAL_STATE_ACTION } from "./general-constant";

export const ORDER_TABLE_HEADER = [
  "No",
  "Order Id",
  "Customer Name",
  "Table",
  "Status",
  "Action",
];

export const INITIAL_ORDER_FORM = {
  customer_name: "",
  table_id: "",
  status: "",
};

export const INITIAL_STATE_ORDER = {
  status: "idle",
  errors: {
    cutomer_name: [],
    table_id: [],
    status: [],
    _form: [],
  },
};

export const INITIAL_ORDER_TAKEAWAY_FORM = {
  customer_name: "",
};

export const INITIAL_STATE_ORDER_TAKEAWAY = {
  status: "idle",
  errors: {
    cutomer_name: [],
    _form: [],
  },
};

export const STATUS_CREATE_ORDER_LIST = [
  {
    value: "reserved",
    label: "Reserved",
  },
  {
    value: "process",
    label: "Process",
  },
];

export const DETAIL_ORDER_TABLE_HEADER = [
  "No",
  "Menu",
  "Total",
  "Status",
  "Action",
];

export const FILTER_MENU = [
  {
    value: "",
    label: "All",
  },
  {
    value: "coffee",
    label: "Coffe",
  },
  {
    value: "pastries",
    label: "Pastries",
  },
  {
    value: "breakfast",
    label: "Breakfast",
  },
  {
    value: "entrees",
    label: "Entrees",
  },
  {
    value: "desserts",
    label: "Desserts",
  },
  {
    value: "mains",
    label: "Mains",
  },
];

export const INITIAL_STATE_GENERATE_PAYMENT = {
  ...INITIAL_STATE_ACTION,
  data: {
    payment_token: "",
  },
};
