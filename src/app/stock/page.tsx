import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getMovements } from "@/lib/queries";
import { formatDateTime, formatNumber } from "@/lib/formatters";

export const dynamic = "force-dynamic";

export default async function Stock() {
  const { supabase } = await requireUser();
  const movements = await getMovements(supabase);

  const stockIn = movements
    .filter((m) => m.movement_type === "IN")
    .reduce((sum, m) => sum + m.quantity, 0);
  const stockOut = movements
    .filter((m) => m.movement_type === "OUT")
    .reduce((sum, m) => sum + m.quantity, 0);

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Stock</h1>
          <p>Receive new stock or record inventory going out.</p>
        </div>
      </div>

      <section className="grid">
        <article className="card">
          <div className="metric-head">
            <span>Total received</span>
            <span className="metric-icon">+</span>
          </div>
          <div className="metric">{formatNumber(stockIn)}</div>
          <span className="trend neutral">Units recorded in</span>
        </article>
        <article className="card">
          <div className="metric-head">
            <span>Total out</span>
            <span className="metric-icon">−</span>
          </div>
          <div className="metric">{formatNumber(stockOut)}</div>
          <span className="trend neutral">Units sold or removed</span>
        </article>
      </section>

      <section className="lower-grid" style={{ marginTop: 20 }}>
        <div className="panel">
          <div className="panel-title">
            <h2>Receive stock</h2>
          </div>
          <p className="empty" style={{ marginBottom: 16 }}>
            Record inventory entering your business from a supplier.
          </p>
          <Link className="primary" href="/stock/in">
            + Receive stock
          </Link>
        </div>
        <div className="panel">
          <div className="panel-title">
            <h2>Stock out</h2>
          </div>
          <p className="empty" style={{ marginBottom: 16 }}>
            Record inventory leaving outside a sale, such as loss or damage.
          </p>
          <Link className="secondary" href="/stock/out">
            Record stock out
          </Link>
        </div>
      </section>

      <section className="panel table-panel" style={{ marginTop: 20 }}>
        <div className="panel-title">
          <h2>Recent movements</h2>
          <Link href="/transactions">View all transactions</Link>
        </div>
        {movements.length ? (
          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>TYPE</th>
                <th>QUANTITY</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {movements.slice(0, 8).map((movement) => {
                const incoming = movement.movement_type === "IN";
                return (
                  <tr key={movement.id}>
                    <td>{movement.product_name}</td>
                    <td>{incoming ? "Stock in" : "Stock out"}</td>
                    <td style={{ color: incoming ? "#23956c" : "#d94b4b" }}>
                      {incoming ? "+" : "−"}
                      {movement.quantity}
                    </td>
                    <td>{formatDateTime(movement.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="empty">No stock movements yet.</p>
        )}
      </section>
    </div>
  );
}