"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductImagesField } from "@/components/admin/product-images-field";

const fieldClass =
  "w-full rounded-lg border border-gold/40 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-clay focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gold";

export function ProductForm({ initial }: { initial?: Product }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [code, setCode] = useState(initial?.code ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [subcategory, setSubcategory] = useState(initial?.subcategory ?? "");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [grossWeight, setGrossWeight] = useState(initial?.grossWeight?.toString() ?? "");
  const [netWeight, setNetWeight] = useState(initial?.netWeight?.toString() ?? "");
  const [size, setSize] = useState(initial?.size ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (images.length === 0) {
      setError("At least one image is required");
      return;
    }
    setLoading(true);
    setError("");

    const payload = {
      code,
      name,
      category,
      subcategory,
      images,
      grossWeight: grossWeight ? Number(grossWeight) : undefined,
      netWeight: netWeight ? Number(netWeight) : undefined,
      size: size || undefined,
    };

    const url = isEdit
      ? `/api/admin/products/${encodeURIComponent(initial!.code)}`
      : "/api/admin/products";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to save product");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="code" className="mb-1 block text-xs font-semibold text-ink">
            Code
          </label>
          <Input
            id="code"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="LRG9899"
            className="h-11 text-sm"
          />
        </div>
        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-semibold text-ink">
            Name
          </label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Opal Blossom Ring"
            className="h-11 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="mb-1 block text-xs font-semibold text-ink">
            Category
          </label>
          <Input
            id="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Rings"
            className="h-11 text-sm"
          />
        </div>
        <div>
          <label htmlFor="subcategory" className="mb-1 block text-xs font-semibold text-ink">
            Subcategory
          </label>
          <Input
            id="subcategory"
            required
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            placeholder="Ladies Rings"
            className="h-11 text-sm"
          />
        </div>
      </div>

      <ProductImagesField images={images} onChange={setImages} />

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="grossWeight" className="mb-1 block text-xs font-semibold text-ink">
            Gross weight (g)
          </label>
          <input
            id="grossWeight"
            type="number"
            step="0.01"
            value={grossWeight}
            onChange={(e) => setGrossWeight(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="netWeight" className="mb-1 block text-xs font-semibold text-ink">
            Net weight (g)
          </label>
          <input
            id="netWeight"
            type="number"
            step="0.01"
            value={netWeight}
            onChange={(e) => setNetWeight(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="size" className="mb-1 block text-xs font-semibold text-ink">
            Size
          </label>
          <input
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading} className="cursor-pointer">
          {loading ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="cursor-pointer text-ink hover:bg-ivory-soft"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
