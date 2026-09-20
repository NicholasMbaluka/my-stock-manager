export type Profile = {
  id: string;
  full_name: string;
  business_name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  user_id: string;
  name: string;
  sku: string | null;
  category: string | null;
  description: string | null;
  cost_price: number;
  selling_price: number;
  low_stock_threshold: number;
  created_at: string;
  updated_at: string;
};

export type StockMovement = {
  id: string;
  product_id: string;
  movement_type: "IN" | "OUT";
  quantity: number;
  unit_price: number | null;
  reference: string | null;
  note: string | null;
  created_at: string;
};

export type Sale = {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total: number;
  customer: string | null;
  created_at: string;
};

/** A product with its derived current stock level. */
export type ProductWithStock = Product & { stock: number };

export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

/** Minimal product shape passed to stock/sale forms. */
export type ProductOption = Pick<
  Product,
  "id" | "name" | "sku" | "selling_price"
> & { stock: number };