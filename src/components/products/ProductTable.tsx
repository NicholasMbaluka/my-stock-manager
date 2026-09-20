"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { deleteProduct } from "@/app/inventory/actions";
import { stockStatus, STOCK_STATUS_LABEL } from "@/lib/calculations";
import { formatCurrency } from "@/lib/formatters";
import type { ProductWithStock } from "@/types/database";
import { StockBadge } from "@/components/ui/StockBadge";

type StatusFilter = "all" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export function ProductTable({ products }: { products: ProductWithStock[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [pending, startTransition] = useTransition();

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        (product.sku ?? "").toLowerCase().includes(q);
      const current = stockStatus(product.stock, product.low_stock_threshold);
      const matchesStatus = status === "all" || current === status;
      return matchesQuery && matchesStatus;
    });
  }, [products, query, status]);

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const result = await deleteProduct(id);
      if (result.error) window.alert(result.error);
    });
  }

  return (
    <div className="panel table-panel">
      <div className="filters">
        <input
          placeholder="Search products..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search products"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as StatusFilter)}
          aria-label="Filter by stock status"
        >
          <option value="all">All stock status</option>
          <option value="IN_STOCK">{STOCK_STATUS_LABEL.IN_STOCK}</option>
          <option value="LOW_STOCK">{STOCK_STATUS_LABEL.LOW_STOCK}</option>
          <option value="OUT_OF_STOCK">
            {STOCK_STATUS_LABEL.OUT_OF_STOCK}
          </option>
        </select>
      </div>

      {rows.length ? (
        <table>
          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>SKU</th>
              <th>STOCK</th>
              <th>PRICE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => (
              <tr key={product.id}>
                <td>
                  <Link href={`/products/${product.id}`}>{product.name}</Link>
                </td>
                <td>{product.sku || "—"}</td>
                <td>{product.stock}</td>
                <td>{formatCurrency(product.selling_price)}</td>
                <td>
                  <StockBadge
                    stock={product.stock}
                    threshold={product.low_stock_threshold}
                  />
                </td>
                <td>
                  <div className="row-actions">
                    <Link href={`/products/${product.id}`}>Edit</Link>
                    <button
                      type="button"
                      className="danger-link"
                      disabled={pending}
                      onClick={() => handleDelete(product.id, product.name)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="empty">No products match your search.</p>
      )}
    </div>
  );
}