import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/queries";
import { formatNumber } from "@/lib/formatters";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { LowStockList } from "@/components/dashboard/LowStockList";
import { StockBadge } from "@/components/ui/StockBadge";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const { supabase, user } = await requireUser();
  const [{ data: profile }, data] = await Promise.all([
    supabase.from("profiles").select("full_name").maybeSingle(),
    getDashboardData(supabase),
  ]);

  const firstName = profile?.full_name?.split(" ")[0] ?? user.email;
  const hasProducts = data.productCount > 0;

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Welcome to MSM{firstName ? `, ${firstName}` : ""}</h1>
          <p>
            {hasProducts
              ? "Here's your inventory at a glance."
              : "No products yet. Add your first product to start managing stock."}
          </p>
        </div>
        <Link className="primary" href="/products/new">
          + Add product
        </Link>
      </div>

      <SummaryCards
        productCount={data.productCount}
        currentStock={data.currentStock}
        todaySales={data.todaySales}
        lowStockCount={data.lowStock.length}
      />

      <section className="lower-grid">
        <div className="panel">
          <div className="panel-title">
            <h2>Recent activity</h2>
            <Link href="/stock">View all</Link>
          </div>
          {data.recentMovements.length ? (
            data.recentMovements.map((movement) => (
              <div className="stock-item" key={movement.id}>
                <span className="product-dot">
                  {movement.movement_type === "IN" ? "+" : "−"}
                </span>
                <div>
                  <strong>{movement.product_name}</strong>
                  <span>
                    {movement.movement_type === "IN" ? "Stock received" : "Stock out"}{" "}
                    · {formatNumber(movement.quantity)} units
                  </span>
                </div>
                <div className="stock-count">
                  <b
                    style={{
                      color:
                        movement.movement_type === "IN" ? "#23956c" : "#d94b4b",
                    }}
                  >
                    {movement.movement_type === "IN" ? "+" : "−"}
                    {movement.quantity}
                  </b>
                </div>
              </div>
            ))
          ) : (
            <p className="empty">No stock movements yet.</p>
          )}
        </div>

        <LowStockList products={data.lowStock} />
      </section>

      <section className="panel table-panel" style={{ marginTop: 20 }}>
        <div className="panel-title">
          <h2>Product / stock overview</h2>
          <Link href="/products">Manage products</Link>
        </div>
        {data.products.length ? (
          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SKU</th>
                <th>STOCK</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {data.products.slice(0, 8).map((product) => (
                <tr key={product.id}>
                  <td>
                    <Link href={`/products/${product.id}`}>{product.name}</Link>
                  </td>
                  <td>{product.sku || "—"}</td>
                  <td>{product.stock}</td>
                  <td>
                    <StockBadge
                      stock={product.stock}
                      threshold={product.low_stock_threshold}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty">
            Add a product to see your stock overview here.
          </p>
        )}
      </section>
    </div>
  );
}