import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import type { Product } from "@/lib/products";
import type { Site } from "@/lib/site";

export type Enquiry = {
  id: number;
  productCode: string | null;
  productName: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: string;
  createdAt: string;
};

export type AdminUser = {
  id: number;
  username: string;
  createdAt: string;
};

type ProductRow = {
  code: string;
  name: string;
  category: string;
  subcategory: string;
  gross_weight: number | null;
  net_weight: number | null;
  size: string | null;
};

const imagesForProduct = db.prepare(
  "SELECT path FROM product_images WHERE product_code = ? ORDER BY sort_order"
);

function rowToProduct(row: ProductRow): Product {
  const images = (imagesForProduct.all(row.code) as { path: string }[]).map((r) => r.path);
  return {
    code: row.code,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory,
    images,
    grossWeight: row.gross_weight ?? undefined,
    netWeight: row.net_weight ?? undefined,
    size: row.size ?? undefined,
  };
}

function replaceProductImages(code: string, images: string[]) {
  db.prepare("DELETE FROM product_images WHERE product_code = ?").run(code);
  const insert = db.prepare(
    "INSERT INTO product_images (product_code, path, sort_order) VALUES (?, ?, ?)"
  );
  images.forEach((path, index) => insert.run(code, path, index));
}

export function listProducts(): Product[] {
  const rows = db
    .prepare("SELECT * FROM products ORDER BY code")
    .all() as ProductRow[];
  return rows.map(rowToProduct);
}

export function getProduct(code: string): Product | null {
  const row = db.prepare("SELECT * FROM products WHERE code = ?").get(code) as
    | ProductRow
    | undefined;
  return row ? rowToProduct(row) : null;
}

export function createProduct(product: Product) {
  const insert = db.transaction((p: Product) => {
    db.prepare(
      `INSERT INTO products (code, name, category, subcategory, gross_weight, net_weight, size)
       VALUES (@code, @name, @category, @subcategory, @grossWeight, @netWeight, @size)`
    ).run({
      code: p.code,
      name: p.name,
      category: p.category,
      subcategory: p.subcategory,
      grossWeight: p.grossWeight ?? null,
      netWeight: p.netWeight ?? null,
      size: p.size ?? null,
    });
    replaceProductImages(p.code, p.images);
  });
  insert(product);
}

export function updateProduct(code: string, product: Product) {
  const update = db.transaction((originalCode: string, p: Product) => {
    // Clear child rows before renaming the parent key, otherwise the FK
    // constraint rejects the rename because it would orphan them.
    db.prepare("DELETE FROM product_images WHERE product_code = ?").run(originalCode);
    db.prepare(
      `UPDATE products
       SET code = @code, name = @name, category = @category, subcategory = @subcategory,
           gross_weight = @grossWeight, net_weight = @netWeight, size = @size
       WHERE code = @originalCode`
    ).run({
      originalCode,
      code: p.code,
      name: p.name,
      category: p.category,
      subcategory: p.subcategory,
      grossWeight: p.grossWeight ?? null,
      netWeight: p.netWeight ?? null,
      size: p.size ?? null,
    });
    replaceProductImages(p.code, p.images);
  });
  update(code, product);
}

export function deleteProduct(code: string) {
  db.prepare("DELETE FROM products WHERE code = ?").run(code);
}

type SiteRow = {
  name: string;
  tagline: string;
  whatsapp_number: string;
  whatsapp_display: string;
  enquiry_email: string;
  website: string;
};

export function getSiteSettings(): Site {
  const row = db
    .prepare("SELECT * FROM site_settings WHERE id = 1")
    .get() as SiteRow;
  return {
    name: row.name,
    tagline: row.tagline,
    whatsappNumber: row.whatsapp_number,
    whatsappDisplay: row.whatsapp_display,
    enquiryEmail: row.enquiry_email,
    website: row.website,
  };
}

export function updateSiteSettings(site: Site) {
  db.prepare(
    `UPDATE site_settings
     SET name = @name, tagline = @tagline, whatsapp_number = @whatsappNumber,
         whatsapp_display = @whatsappDisplay, enquiry_email = @enquiryEmail, website = @website
     WHERE id = 1`
  ).run(site);
}

type EnquiryRow = {
  id: number;
  product_code: string | null;
  product_name: string | null;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

function rowToEnquiry(row: EnquiryRow): Enquiry {
  return {
    id: row.id,
    productCode: row.product_code,
    productName: row.product_name,
    name: row.name,
    phone: row.phone,
    email: row.email,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function createEnquiry(input: {
  productCode?: string | null;
  productName?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
}) {
  db.prepare(
    `INSERT INTO enquiries (product_code, product_name, name, phone, email, message, status, created_at)
     VALUES (@productCode, @productName, @name, @phone, @email, @message, 'new', @createdAt)`
  ).run({
    productCode: input.productCode ?? null,
    productName: input.productName ?? null,
    name: input.name,
    phone: input.phone,
    email: input.email ?? null,
    message: input.message ?? null,
    createdAt: new Date().toISOString(),
  });
}

export function listEnquiries(): Enquiry[] {
  const rows = db
    .prepare("SELECT * FROM enquiries ORDER BY created_at DESC")
    .all() as EnquiryRow[];
  return rows.map(rowToEnquiry);
}

export function updateEnquiryStatus(id: number, status: string) {
  db.prepare("UPDATE enquiries SET status = ? WHERE id = ?").run(status, id);
}

export function deleteEnquiry(id: number) {
  db.prepare("DELETE FROM enquiries WHERE id = ?").run(id);
}

type AdminUserRow = {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
};

export function listAdminUsers(): AdminUser[] {
  const rows = db
    .prepare("SELECT id, username, created_at FROM admin_users ORDER BY created_at")
    .all() as Omit<AdminUserRow, "password_hash">[];
  return rows.map((r) => ({ id: r.id, username: r.username, createdAt: r.created_at }));
}

export function createAdminUser(username: string, password: string): AdminUser {
  const createdAt = new Date().toISOString();
  const result = db
    .prepare(
      "INSERT INTO admin_users (username, password_hash, created_at) VALUES (?, ?, ?)"
    )
    .run(username, hashPassword(password), createdAt);
  return { id: Number(result.lastInsertRowid), username, createdAt };
}

export function deleteAdminUser(id: number) {
  db.prepare("DELETE FROM admin_users WHERE id = ?").run(id);
}

export function countAdminUsers(): number {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM admin_users").get() as {
    count: number;
  };
  return count;
}

export function verifyAdminLogin(
  username: string,
  password: string
): AdminUser | null {
  const row = db
    .prepare("SELECT * FROM admin_users WHERE username = ?")
    .get(username) as AdminUserRow | undefined;
  if (!row) return null;
  if (!verifyPassword(password, row.password_hash)) return null;
  return { id: row.id, username: row.username, createdAt: row.created_at };
}
