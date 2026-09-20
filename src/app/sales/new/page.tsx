import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getProductOptions } from "@/lib/queries";
import { SaleForm } from "@/components/sales/SaleForm";

export const dynamic = "force-dynamic";

export default async function NewSale() {
  const { supabase } = await requireUser();
  const products = await getProductOptions(supabase);

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Record sale</h1>
          <p>Add a sale and update your stock automatically.</p>
        </div>
      </div>
      {products.length ? (
        <SaleForm products={products} />
      ) : (
        <div className="panel">
          <p className="empty">
            Add a product first, then you can record sales.{" "}
            <Link href="/products/new">Add a product</Link>.
          </p>
        </div>
      )}
    </div>
  );
}