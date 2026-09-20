import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getSales } from "@/lib/queries";
import { formatCurrency, formatDateTime } from "@/lib/formatters";

export const dynamic = "force-dynamic";

export default async function Sales() {
  const { supabase } = await requireUser();
  const sales = await getSales(supabase);

  const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
  const totalUnits = sales.reduce((sum, sale) => sum + sale.quantity, 0);

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Sales</h1>
          <p>Keep a clear record of your sales activity.</p>
        </div>
        <Link className="primary" href="/sales/new">
          + Record sale
        </Link>
      </div>

      <section className="grid">
        <article className="card">
          <div className="metric-head">
            <span>Total revenue</span>
            <span className="metric-icon">↗</span>
          </div>
          <div className="metric">{formatCurrency(totalRevenue)}</div>
          <span className="trend neutral">Across all recorded sales</span>
        </article>
        <article className="card">
          <div className="metric-head">
            <span>Units sold</span>
            <span className="metric-icon">◈</span>
          </div>
          <div className="metric">{totalUnits}</div>
          <span className="trend neutral">Total items sold</span>
        </article>
        <article className="card">
          <div className="metric-head">
            <span>Sales recorded</span>
            <span className="metric-icon">▤</span>
          </div>
          <div className="metric">{sales.length}</div>
          <span className="trend neutral">Transactions</span>
        </article>
      </section>

      {sales.length ? (
        <div className="panel table-panel" style={{ marginTop: 20 }}>
          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>QTY</th>
                <th>UNIT PRICE</th>
                <th>TOTAL</th>
                <th>CUSTOMER</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.product_name}</td>
                  <td>{sale.quantity}</td>
                  <td>{formatCurrency(sale.unit_price)}</td>
                  <td>{formatCurrency(sale.total)}</td>
                  <td>{sale.customer || "—"}</td>
                  <td>{formatDateTime(sale.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="panel" style={{ marginTop: 20 }}>
          <p className="empty">
            No sales yet. Record a sale to see your sales history here.
          </p>
        </div>
      )}
    </div>
  );
}