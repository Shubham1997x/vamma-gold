export type Product = {
  /** Code printed on the jewellery tag, e.g. LRG9899 */
  code: string;
  name: string;
  category: string;
  subcategory: string;
  image: string;
  /** Gross weight in grams */
  grossWeight?: number;
  /** Net weight in grams */
  netWeight?: number;
  size?: string;
};

/**
 * Add new products here — categories, subcategories, search and
 * filters on the site all update automatically from this list.
 * Put the photo in public/images and reference it below.
 */
export const products: Product[] = [
  {
    code: "LRG9899",
    name: "Opal Blossom Ring",
    category: "Rings",
    subcategory: "Ladies Rings",
    image: "/images/lrg9899.jpeg",
    grossWeight: 2.28,
    netWeight: 2.28,
    size: "16",
  },
  {
    code: "LRG9891",
    name: "Ruby Petal Ring",
    category: "Rings",
    subcategory: "Ladies Rings",
    image: "/images/lrg9891.jpeg",
    grossWeight: 2.44,
    netWeight: 2.44,
    size: "17",
  },
  {
    code: "LVG0077",
    name: "Heart Solitaire Ring",
    category: "Rings",
    subcategory: "Ladies Rings",
    image: "/images/lvg0077.jpeg",
    grossWeight: 1.94,
    netWeight: 1.89,
    size: "14",
  },
  {
    code: "MM/10",
    name: "Entwined Loop Ring",
    category: "Rings",
    subcategory: "Ladies Rings",
    image: "/images/mm10.jpeg",
    grossWeight: 3.19,
  },
];

export const categories = [...new Set(products.map((p) => p.category))];

export function subcategoriesOf(category: string) {
  return [
    ...new Set(
      products.filter((p) => p.category === category).map((p) => p.subcategory)
    ),
  ];
}
