import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Add Product</h1>
      <ProductForm />
    </div>
  );
}
