import type { Product, StockStatus } from "@/types/database";

export type StockByProduct = Map<string, number>;

type MovementLike = {
  product_id: string;
  movement_type: "IN" | "OUT";
  quantity: number;
};

/** Derive current stock per product from the stock movement ledger. */
export function computeStockByProduct(movements: MovementLike[]): StockByProduct {
  const stock: StockByProduct = new Map();
  for (const movement of movements) {
    const delta =
      movement.movement_type === "IN" ? movement.quantity : -movement.quantity;
    stock.set(movement.product_id, (stock.get(movement.product_id) ?? 0) + delta);
  }
  return stock;
}

export const stockOf = (stock: StockByProduct, productId: string): number =>
  stock.get(productId) ?? 0;

export const totalStock = (stock: StockByProduct): number =>
  [...stock.values()].reduce((sum, value) => sum + value, 0);

/** Total retail value of stock on hand, based on selling prices. */
export const inventoryValue = (
  products: Pick<Product, "id" | "selling_price">[],
  stock: StockByProduct,
): number =>
  products.reduce(
    (sum, product) => sum + stockOf(stock, product.id) * product.selling_price,
    0,
  );

/** Classify a product's stock level against its low-stock threshold. */
export function stockStatus(
  currentStock: number,
  lowStockThreshold: number,
): StockStatus {
  if (currentStock <= 0) return "OUT_OF_STOCK";
  if (currentStock <= lowStockThreshold) return "LOW_STOCK";
  return "IN_STOCK";
}

export const STOCK_STATUS_LABEL: Record<StockStatus, string> = {
  IN_STOCK: "In stock",
  LOW_STOCK: "Low stock",
  OUT_OF_STOCK: "Out of stock",
};

export const isLowStock = (
  currentStock: number,
  lowStockThreshold: number,
): boolean => stockStatus(currentStock, lowStockThreshold) !== "IN_STOCK";