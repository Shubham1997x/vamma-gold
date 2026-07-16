import Link from "next/link";
import Image from "next/image";
import { listProducts } from "@/lib/db/queries";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminProductsPage() {
  const products = listProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-ink">Products</h1>
        <Link href="/admin/products/new">
          <Button size="sm" className="cursor-pointer">
            Add Product
          </Button>
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gold/25 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gold/20 text-[10px] font-semibold uppercase tracking-[0.15em] text-clay">
            <tr>
              <th className="px-4 py-3" />
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Subcategory</th>
              <th className="px-4 py-3">Gross (g)</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.code} className="border-b border-gold/10 last:border-0">
                <td className="px-4 py-3">
                  <div className="relative size-10 overflow-hidden rounded-md border border-gold/25 bg-ivory-soft">
                    {p.images[0] && (
                      <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />
                    )}
                  </div>
                  {p.images.length > 1 && (
                    <span className="mt-0.5 block text-center text-[9px] text-clay">
                      +{p.images.length - 1}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-semibold text-gold-deep">{p.code}</td>
                <td className="px-4 py-3 text-ink">{p.name}</td>
                <td className="px-4 py-3 text-clay">{p.category}</td>
                <td className="px-4 py-3 text-clay">{p.subcategory}</td>
                <td className="px-4 py-3 tabular-nums text-clay">
                  {p.grossWeight?.toFixed(3) ?? "—"}
                </td>
                <td className="px-4 py-3 text-clay">{p.size ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/products/${encodeURIComponent(p.code)}`}
                      className="text-xs font-semibold text-gold-deep hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteButton
                      url={`/api/admin/products/${encodeURIComponent(p.code)}`}
                      confirmMessage={`Delete product ${p.code}?`}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-clay">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
