import { notFound } from "next/navigation";
import { getProduct } from "@/lib/db/queries";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const product = getProduct(decodeURIComponent(code));
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Edit Product</h1>
      <ProductForm initial={product} />
    </div>
  );
}
