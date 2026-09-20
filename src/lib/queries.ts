import type { createClient } from "@/lib/supabase/server";
import {
  computeStockByProduct,
  stockOf,
  type StockByProduct,
} from "@/lib/calculations";
import type {
  Product,
  ProductOption,
  ProductWithStock,
  Sale,
  StockMovement,
} from "@/types/database";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export type MovementRow = StockMovement & { product_name: string };
export type SaleRow = Sale & { product_name: string };

/** Load every product together with its derived current stock level. */
export async function getProductsWithStock(
  supabase: Supabase,
): Promise<ProductWithStock[]> {
  const [{ data: products }, { data: movements }] = await Promise.all([
    supabase.from("products").select("*").order("name"),
    supabase.from("stock_movements").select("product_id, movement_type, quantity"),
  ]);
  const stock = computeStockByProduct(movements ?? []);
  return (products ?? []).map((product) => ({
    ...(product as Product),
    stock: stockOf(stock, product.id),
  }));
}

/** Load the derived stock map for all products. */
export async function getStockMap(supabase: Supabase): Promise<StockByProduct> {
  const { data: movements } = await supabase
    .from("stock_movements")
    .select("product_id, movement_type, quantity");
  return computeStockByProduct(movements ?? []);
}

/** Products in a compact shape used by the stock and sale forms. */
export async function getProductOptions(
  supabase: Supabase,
): Promise<ProductOption[]> {
  const products = await getProductsWithStock(supabase);
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    selling_price: p.selling_price,
    stock: p.stock,
  }));
}

export async function getProduct(
  supabase: Supabase,
  id: string,
): Promise<ProductWithStock | null> {
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!product) return null;
  const { data: movements } = await supabase
    .from("stock_movements")
    .select("movement_type, quantity")
    .eq("product_id", id);
  const stock = (movements ?? []).reduce(
    (sum, m) => sum + (m.movement_type === "IN" ? m.quantity : -m.quantity),
    0,
  );
  return { ...(product as Product), stock };
}

/** Full stock movement ledger with product names, newest first. */
export async function getMovements(supabase: Supabase): Promise<MovementRow[]> {
  const [{ data: movements }, { data: products }] = await Promise.all([
    supabase
      .from("stock_movements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("products").select("id, name"),
  ]);
  const names = new Map((products ?? []).map((p) => [p.id, p.name]));
  return (movements ?? []).map((m) => ({
    ...(m as StockMovement),
    product_name: names.get(m.product_id) ?? "Unknown product",
  }));
}

/** Sales history with product names, newest first. */
export async function getSales(supabase: Supabase): Promise<SaleRow[]> {
  const [{ data: sales }, { data: products }] = await Promise.all([
    supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("products").select("id, name"),
  ]);
  const names = new Map((products ?? []).map((p) => [p.id, p.name]));
  return (sales ?? []).map((s) => ({
    ...(s as Sale),
    product_name: names.get(s.product_id) ?? "Unknown product",
  }));
}

export type DashboardData = {
  productCount: number;
  currentStock: number;
  todaySales: number;
  lowStock: ProductWithStock[];
  recentMovements: MovementRow[];
  products: ProductWithStock[];
};

/** Aggregate everything the dashboard needs in one pass. */
export async function getDashboardData(
  supabase: Supabase,
): Promise<DashboardData> {
  const products = await getProductsWithStock(supabase);
  const [movements, sales] = await Promise.all([
    getMovements(supabase),
    getSales(supabase),
  ]);

  const currentStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStock = products.filter((p) => p.stock <= p.low_stock_threshold);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const todaySales = sales
    .filter((s) => new Date(s.created_at) >= startOfDay)
    .reduce((sum, s) => sum + Number(s.total), 0);

  return {
    productCount: products.length,
    currentStock,
    todaySales,
    lowStock,
    recentMovements: movements.slice(0, 8),
    products,
  };
}