import { requireUser } from "@/lib/auth";
import { getProductOptions } from "@/lib/queries";
import { StockMovementForm } from "@/components/stock/StockMovementForm";

export const dynamic = "force-dynamic";

export default async function StockOut() {
  const { supabase } = await requireUser();
  const products = await getProductOptions(supabase);

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Record stock out</h1>
          <p>Record inventory removed outside a sale.</p>
        </div>
      </div>
      {products.length ? (
        <StockMovementForm type="OUT" products={products} />
      ) : (
        <div className="panel">
          <p className="empty">
            Add a product first, then you can record stock going out.
          </p>
        </div>
      )}
    </div>
  );
}