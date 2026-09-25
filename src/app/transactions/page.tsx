import { requireUser } from "@/lib/auth";
import { getMovements } from "@/lib/queries";
import { formatCurrency, formatDateTime } from "@/lib/formatters";

export const dynamic = "force-dynamic";

export default async function Transactions() {
  const { supabase } = await requireUser();
  const movements = await getMovements(supabase);

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Transactions</h1>
          <p>Every stock movement in and out of your business.</p>
        </div>
      </div>

      {movements.length ? (
        <div className="panel table-panel">
          <table>
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>TYPE</th>
                <th>QUANTITY</th>
                <th>UNIT PRICE</th>
                <th>REFERENCE</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((movement) => {
                const incoming = movement.movement_type === "IN";
                return (
                  <tr key={movement.id}>
                    <td>{movement.product_name}</td>
                    <td>{incoming ? "Stock in" : "Stock out"}</td>
                    <td style={{ color: incoming ? "#23956c" : "#d94b4b" }}>
                      {incoming ? "+" : "−"}
                      {movement.quantity}
                    </td>
                    <td>
                      {movement.unit_price !== null
                        ? formatCurrency(movement.unit_price)
                        : "—"}
                    </td>
                    <td>{movement.reference || "—"}</td>
                    <td>{formatDateTime(movement.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="panel">
          <p className="empty">
            No transactions yet. Receive stock or record a sale to get started.
          </p>
        </div>
      )}
    </div>
  );
}