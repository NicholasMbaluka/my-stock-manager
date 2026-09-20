"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { recordMovement, type ActionState } from "@/app/inventory/actions";
import { formatCurrency } from "@/lib/formatters";
import type { ProductOption } from "@/types/database";

const initial: ActionState = {};

export function StockMovementForm({
  type,
  products,
}: {
  type: "IN" | "OUT";
  products: ProductOption[];
}) {
  const outgoing = type === "OUT";
  const [state, action, pending] = useActionState(recordMovement, initial);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");

  const selected = products.find((p) => p.id === productId);
  const qty = Number(quantity) || 0;
  const price = Number(unitPrice) || 0;
  const total = outgoing && price > 0 ? qty * price : 0;

  return (
    <form action={action} className="panel form-card">
      <input type="hidden" name="type" value={type} />

      <div className="field">
        <label htmlFor="productId">Product</label>
        <select
          id="productId"
          name="productId"
          value={productId}
          onChange={(event) => setProductId(event.target.value)}
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
            Current stock: {selected.stock} · Selling price:{" "}
            {formatCurrency(selected.selling_price)}
          </span>
        )}
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="quantity">Quantity</label>
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
          {outgoing && selected && qty > selected.stock && (
            <span className="field-error">
              Only {selected.stock} in stock.
            </span>
          )}
        </div>

        {outgoing && (
          <div className="field">
            <label htmlFor="unitPrice">Sale price per unit (optional)</label>
            <input
              id="unitPrice"
              name="unitPrice"
              type="number"
              min="0"
              step="0.01"
              value={unitPrice}
              onChange={(event) => setUnitPrice(event.target.value)}
              placeholder={
                selected ? String(selected.selling_price) : "0.00"
              }
              disabled={pending}
            />
            <span className="field-hint">
              Leave blank for stock loss/damage. Enter a price to record a sale.
            </span>
          </div>
        )}
      </div>

      {outgoing && total > 0 && (
        <p className="form-total">
          Sale total: <strong>{formatCurrency(total)}</strong>
        </p>
      )}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="reference">
            {outgoing ? "Reference (optional)" : "Supplier / reference"}
          </label>
          <input
            id="reference"
            name="reference"
            placeholder={
              outgoing ? "e.g. INV-1042" : "e.g. Supplier name"
            }
            disabled={pending}
          />
        </div>
        {outgoing && (
          <div className="field">
            <label htmlFor="customer">Customer (optional)</label>
            <input
              id="customer"
              name="customer"
              placeholder="Walk-in customer"
              disabled={pending}
            />
          </div>
        )}
      </div>

      <div className="field">
        <label htmlFor="note">Note (optional)</label>
        <input
          id="note"
          name="note"
          placeholder="Add a reference or note"
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
        <Link className="secondary" href="/stock">
          Cancel
        </Link>
        <button className="primary" disabled={pending}>
          {pending
            ? "Recording…"
            : outgoing
              ? "Record stock out"
              : "Receive stock"}
        </button>
      </div>
    </form>
  );
}