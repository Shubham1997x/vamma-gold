export type Product = {
  /** Code printed on the jewellery tag, e.g. LRG9899 */
  code: string;
  name: string;
  category: string;
  subcategory: string;
  /** Ordered image paths; the first is the cover image */
  images: string[];
  /** Gross weight in grams */
  grossWeight?: number;
  /** Net weight in grams */
  netWeight?: number;
  size?: string;
};

export function categoriesOf(products: Product[]) {
  return [...new Set(products.map((p) => p.category))];
}

export function subcategoriesOf(products: Product[], category: string) {
  return [
    ...new Set(
      products.filter((p) => p.category === category).map((p) => p.subcategory)
    ),
  ];
}
