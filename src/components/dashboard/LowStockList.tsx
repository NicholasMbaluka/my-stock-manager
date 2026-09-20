import Link from "next/link";
import type { ProductWithStock } from "@/types/database";

export function LowStockList({ products }: { products: ProductWithStock[] }) {
  return (
    <div className="panel">
      <div className="panel-title">
        <h2>Low stock items</h2>
        <Link href="/products">View all</Link>
      </div>
      {products.length ? (
        products.slice(0, 6).map((product) => (
          <div className="stock-item" key={product.id}>
            <span className="product-dot">▦</span>
            <div>
              <strong>{product.name}</strong>
              <span>
                {product.sku || "No SKU"} · Threshold{" "}
                {product.low_stock_threshold}
              </span>
            </div>
            <div className="stock-count">
              <b>{product.stock} left</b>
            </div>
          </div>
        ))
      ) : (
        <p className="empty">Your inventory is looking healthy.</p>
      )}
    </div>
  );
}