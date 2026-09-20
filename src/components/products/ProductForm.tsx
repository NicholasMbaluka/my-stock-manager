"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  saveProduct,
  updateProduct,
  type ActionState,
} from "@/app/inventory/actions";
import type { ProductWithStock } from "@/types/database";

const initial: ActionState = {};

export function ProductForm({ product }: { product?: ProductWithStock }) {
  const editing = Boolean(product);
  const [state, action, pending] = useActionState(
    editing ? updateProduct : saveProduct,
    initial,
  );

  return (
    <form action={action} className="panel form-card">
      {editing && <input type="hidden" name="id" value={product!.id} />}
      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Product name</label>
          <input
            id="name"
            name="name"
            defaultValue={product?.name ?? ""}
            placeholder="e.g. Coca-Cola 500ml"
            required
            disabled={pending}
          />
        </div>
        <div className="field">
          <label htmlFor="sku">SKU / code (optional)</label>
          <input
            id="sku"
            name="sku"
            defaultValue={product?.sku ?? ""}
            placeholder="e.g. SKU-1042"
            disabled={pending}
          />
        </div>
        <div className="field">
          <label htmlFor="category">Category (optional)</label>
          <input
            id="category"
            name="category"
            defaultValue={product?.category ?? ""}
            placeholder="e.g. Beverages"
            disabled={pending}
          />
        </div>
        <div className="field">
          <label htmlFor="sellingPrice">Selling price</label>
          <input
            id="sellingPrice"
            name="sellingPrice"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product?.selling_price ?? 0}
            required
            disabled={pending}
          />
        </div>
        <div className="field">
          <label htmlFor="costPrice">Cost price</label>
          <input
            id="costPrice"
            name="costPrice"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product?.cost_price ?? 0}
            required
            disabled={pending}
          />
        </div>
        <div className="field">
          <label htmlFor="threshold">Low-stock alert at</label>
          <input
            id="threshold"
            name="threshold"
            type="number"
            min="0"
            step="1"
            defaultValue={product?.low_stock_threshold ?? 0}
            required
            disabled={pending}
          />
        </div>
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
        <Link className="secondary" href="/products">
          Cancel
        </Link>
        <button className="primary" disabled={pending}>
          {pending ? "Saving…" : editing ? "Save changes" : "Create product"}
        </button>
      </div>
    </form>
  );
}