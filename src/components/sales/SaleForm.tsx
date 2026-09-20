"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { recordMovement, type ActionState } from "@/app/inventory/actions";
import { formatCurrency } from "@/lib/formatters";
import type { ProductOption } from "@/types/database";

const initial: ActionState = {};

export function SaleForm({ products }: { products: ProductOption[] }) {
  const [state, action, pending] = useActionState(recordMovement, initial);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  const selected = products.find((p) => p.id === productId);
  const qty = Number(quantity) || 0;
  const price = Number(unitPrice) || 0;
  const total = qty * price;

  return (
    <form action={action} className="panel form-card">
      <input type="hidden" name="type" value="OUT" />

      <div className="field">
        <label htmlFor="productId">Product</label>
        <select
          id="productId"
          name="productId"
          value={productId}
          onChange={(event) => {
            setProductId(event.target.value);
            const product = products.find((p) => p.id === event.target.value);
            setUnitPrice(product ? String(product.selling_price) : "");
          }}
          required
          disabled={pending}
        >
          <option value="" disabled>
            Select product
          </option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
              {product.sku ? ` (${product.sku})` : ""} — {product.stock} in
              stock
            </option>
          ))}
        </select>
        {selected && (
          <span className="field-hint">
            In stock: {selected.stock} · Default price:{" "}
            {formatCurrency(selected.selling_price)}
          </span>
        )}
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="quantity">Quantity sold</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            placeholder="0"
            required
            disabled={pending}
          />
          {selected && qty > selected.stock && (
            <span className="field-error">
              Only {selected.stock} in stock.
            </span>
          )}
        </div>
        <div className="field">
          <label htmlFor="unitPrice">Sale price per unit</label>
          <input
            id="unitPrice"
            name="unitPrice"
            type="number"
            min="0"
            step="0.01"
            value={unitPrice}
            onChange={(event) => setUnitPrice(event.target.value)}
            placeholder="0.00"
            required
            disabled={pending}
          />
        </div>
      </div>

      <p className="form-total">
        Sale total: <strong>{formatCurrency(total)}</strong>
      </p>

      <div className="field">
        <label htmlFor="customer">Customer (optional)</label>
        <input
          id="customer"
          name="customer"
          placeholder="Customer name"
          disabled={pending}
        />
      </div>

      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}
      {state.message && (
        <p className="form-success" role="status">
          {state.message}
        </p>
      )}

      <div className="form-actions">
        <Link className="secondary" href="/sales">
          Cancel
        </Link>
        <button className="primary" disabled={pending}>
          {pending ? "Recording…" : "Record sale"}
        </button>
      </div>
    </form>
  );
}