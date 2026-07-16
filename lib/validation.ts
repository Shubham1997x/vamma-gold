import type { Product } from "@/lib/products";

export function parseProduct(body: unknown): Product | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const images = Array.isArray(b.images)
    ? b.images.filter((i): i is string => typeof i === "string" && i.trim().length > 0).map((i) => i.trim())
    : [];

  if (
    typeof b.code !== "string" ||
    typeof b.name !== "string" ||
    typeof b.category !== "string" ||
    typeof b.subcategory !== "string" ||
    !b.code.trim() ||
    !b.name.trim() ||
    !b.category.trim() ||
    !b.subcategory.trim() ||
    images.length === 0
  ) {
    return null;
  }

  return {
    code: b.code.trim(),
    name: b.name.trim(),
    category: b.category.trim(),
    subcategory: b.subcategory.trim(),
    images,
    grossWeight: typeof b.grossWeight === "number" ? b.grossWeight : undefined,
    netWeight: typeof b.netWeight === "number" ? b.netWeight : undefined,
    size: typeof b.size === "string" && b.size.trim() ? b.size.trim() : undefined,
  };
}
