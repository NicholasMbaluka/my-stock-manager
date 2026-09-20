import { ProductForm } from "@/components/products/ProductForm";

export default function NewProduct() {
  return (
    <div className="content">
      <div className="page-head">
        <div>
          <h1>Add product</h1>
          <p>Create a new item for your inventory.</p>
        </div>
      </div>
      <ProductForm />
    </div>
  );
}