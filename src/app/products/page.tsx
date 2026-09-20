import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getProductsWithStock } from "@/lib/queries";
import { ProductTable } from "@/components/products/ProductTable";

export const dynamic = "force-dynamic";

export default async function Products() {
  const { supabase } = await requireUser();
  const products = await getProductsWithStock(supabase);

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Products</h1>
          <p>Manage your inventory catalogue and stock levels.</p>
        </div>
        <Link className="primary" href="/products/new">
          + Add product
        </Link>
      </div>
      <ProductTable products={products} />
    </div>
  );
}