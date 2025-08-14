export const MENU_TABLE_HEADER = [
  "No",
  "Name",
  "Category",
  "Price",
  "Availability",
  "Action",
];

export const CATEGORY_LIST = [
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

export const AVAILABILITY_LIST = [
  {
    value: "true",
    label: "Available",
  },
  {
    value: "false",
    label: "Not Available",
  },
];

export const INITIAL_MENU_FORM = {
  name: "",
  description: "",
  price: "",
  discount: "",
  category: "",
  image_url: "",
  is_available: "",
};

export const INITIAL_STATE_MENU = {
  status: "idle",
  errors: {
    id: [],
    name: [],
    description: [],
    price: [],
    discount: [],
    category: [],
    image_url: [],
    is_available: [],
    _form: [],
  },
};
