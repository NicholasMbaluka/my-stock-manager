import { requireUser } from "@/lib/auth";
import { getProductOptions } from "@/lib/queries";
import { StockMovementForm } from "@/components/stock/StockMovementForm";

export const dynamic = "force-dynamic";

export default async function ReceiveStock() {
  const { supabase } = await requireUser();
  const products = await getProductOptions(supabase);

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Receive stock</h1>
          <p>Add new inventory from a supplier.</p>
        </div>
      </div>
      {products.length ? (
        <StockMovementForm type="IN" products={products} />
      ) : (
        <div className="panel">
          <p className="empty">
            Add a product first, then you can receive stock for it.
          </p>
        </div>
      )}
    </div>
  );
}