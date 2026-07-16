"use client";

import { useMemo, useState } from "react";
import { categoriesOf, subcategoriesOf, type Product } from "@/lib/products";
import type { Site } from "@/lib/site";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";

const ALL = "All";

export function Catalog({ products, site }: { products: Product[]; site: Site }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [subcategory, setSubcategory] = useState(ALL);

  const categories = useMemo(() => categoriesOf(products), [products]);

  const subcategories = useMemo(
    () => (category === ALL ? [] : subcategoriesOf(products, category)),
    [products, category]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (category !== ALL && p.category !== category) return false;
      if (subcategory !== ALL && p.subcategory !== subcategory) return false;
      if (!q) return true;
      return [p.name, p.code, p.category, p.subcategory]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [products, query, category, subcategory]);

  function pickCategory(next: string) {
    setCategory(next);
    setSubcategory(ALL);
  }

  return (
    <section id="collection" className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      {/* search */}
      <div className="mt-8 max-w-sm">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or code"
          aria-label="Search products"
          className="h-10 text-sm"
        />
      </div>

      {/* category & subcategory filters */}
      <div className="mt-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {[ALL, ...categories].map((c) => (
            <button key={c} onClick={() => pickCategory(c)} className="cursor-pointer">
              <Badge variant={category === c ? "active" : "default"}>{c}</Badge>
            </button>
          ))}
        </div>
        {subcategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {[ALL, ...subcategories].map((s) => (
              <button key={s} onClick={() => setSubcategory(s)} className="cursor-pointer">
                <Badge variant={subcategory === s ? "active" : "default"}>{s}</Badge>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* products */}
      <div className="mt-10 flex items-center gap-4">
        <h2 className="font-display text-3xl font-semibold text-ink">
          {category === ALL ? "Our Collection" : category}
        </h2>
        <div className="gold-rule flex-1" />
        <p className="text-xs font-semibold uppercase tracking-widest text-clay">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="my-20 text-center">
          <p className="font-display text-2xl text-ink">No pieces match your search</p>
          <p className="mt-2 text-sm text-clay">
            Try a different name or code, or clear the filters above.
          </p>
        </div>
      ) : (
        <div className="mb-20 mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.code} product={p} index={i} site={site} />
          ))}
        </div>
      )}
    </section>
  );
}
