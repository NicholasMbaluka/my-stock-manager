import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getProduct, getMovements } from "@/lib/queries";
import { formatCurrency } from "@/lib/formatters";
import { ProductForm } from "@/components/products/ProductForm";
import { StockBadge } from "@/components/ui/StockBadge";

export const dynamic = "force-dynamic";

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { supabase } = await requireUser();
  const product = await getProduct(supabase, id);
  if (!product) notFound();

  const movements = (await getMovements(supabase)).filter(
    (m) => m.product_id === product.id,
  );

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>{product.name}</h1>
          <p>
            {product.sku || "No SKU"}
            {product.category ? ` · ${product.category}` : ""}
          </p>
        </div>
        <div>
          <Link className="secondary" href={`/stock/in?product=${product.id}`}>
            Receive stock
          </Link>{" "}
          <Link className="primary" href={`/sales/new?product=${product.id}`}>
            Record sale
          </Link>
        </div>
      </div>

      <section className="grid">
        <article className="card">
          <div className="metric-head">
            <span>Available stock</span>
          </div>
          <div className="metric">{product.stock}</div>
          <StockBadge
            stock={product.stock}
            threshold={product.low_stock_threshold}
          />
        </article>
        <article className="card">
          <div className="metric-head">
            <span>Selling price</span>
          </div>
          <div className="metric">{formatCurrency(product.selling_price)}</div>
          <span className="trend neutral">Per unit</span>
        </article>
        <article className="card">
          <div className="metric-head">
            <span>Cost price</span>
          </div>
          <div className="metric">{formatCurrency(product.cost_price)}</div>
          <span className="trend neutral">Per unit</span>
        </article>
        <article className="card">
          <div className="metric-head">
            <span>Low-stock threshold</span>
          </div>
          <div className="metric">{product.low_stock_threshold}</div>
          <span className="trend neutral">Alert when at or below</span>
        </article>
      </section>

      <div className="page-head" style={{ marginTop: 30, marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 20 }}>Edit product</h1>
        </div>
      </div>
      <ProductForm product={product} />

      <section className="panel table-panel" style={{ marginTop: 20 }}>
        <div className="panel-title">
          <h2>Stock history</h2>
          <Link href="/stock">View all movement</Link>
        </div>
        {movements.length ? (
          <table>
            <thead>
              <tr>
                <th>TYPE</th>
                <th>QUANTITY</th>
                <th>REFERENCE</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((movement) => (
                <tr key={movement.id}>
                  <td>
                    {movement.movement_type === "IN"
                      ? "Stock in"
                      : "Stock out"}
                  </td>
                  <td
                    style={{
                      color:
                        movement.movement_type === "IN" ? "#23956c" : "#d94b4b",
                    }}
                  >
                    {movement.movement_type === "IN" ? "+" : "−"}
                    {movement.quantity}
                  </td>
                  <td>{movement.reference || "—"}</td>
                  <td>{new Date(movement.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty">No stock movement recorded for this product.</p>
        )}
      </section>
    </div>
  );
}