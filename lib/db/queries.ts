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

type ProductWithImages = {
  code: string;
  name: string;
  category: string;
  subcategory: string;
  grossWeight: number | null;
  netWeight: number | null;
  size: string | null;
  images: { path: string }[];
};

function toProduct(row: ProductWithImages): Product {
  return {
    code: row.code,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory,
    images: row.images.map((i) => i.path),
    grossWeight: row.grossWeight ?? undefined,
    netWeight: row.netWeight ?? undefined,
    size: row.size ?? undefined,
  };
}

export async function listProducts(): Promise<Product[]> {
  const rows = await db.product.findMany({
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { code: "asc" },
  });
  return rows.map(toProduct);
}

export async function getProduct(code: string): Promise<Product | null> {
  const row = await db.product.findUnique({
    where: { code },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  return row ? toProduct(row) : null;
}

export async function createProduct(product: Product) {
  await db.product.create({
    data: {
      code: product.code,
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      grossWeight: product.grossWeight ?? null,
      netWeight: product.netWeight ?? null,
      size: product.size ?? null,
      images: {
        create: product.images.map((path, index) => ({ path, sortOrder: index })),
      },
    },
  });
}

export async function updateProduct(code: string, product: Product) {
  await db.$transaction(async (tx) => {
    // Clear child rows before renaming the parent key, otherwise the FK
    // constraint rejects the rename because it would orphan them.
    await tx.productImage.deleteMany({ where: { productCode: code } });
    await tx.product.update({
      where: { code },
      data: {
        code: product.code,
        name: product.name,
        category: product.category,
        subcategory: product.subcategory,
        grossWeight: product.grossWeight ?? null,
        netWeight: product.netWeight ?? null,
        size: product.size ?? null,
      },
    });
    await tx.productImage.createMany({
      data: product.images.map((path, index) => ({
        productCode: product.code,
        path,
        sortOrder: index,
      })),
    });
  });
}

export async function deleteProduct(code: string) {
  await db.product.delete({ where: { code } });
}

export async function getSiteSettings(): Promise<Site> {
  const row = await db.siteSettings.findUniqueOrThrow({ where: { id: 1 } });
  return {
    name: row.name,
    tagline: row.tagline,
    whatsappNumber: row.whatsappNumber,
    whatsappDisplay: row.whatsappDisplay,
    enquiryEmail: row.enquiryEmail,
    website: row.website,
  };
}

export async function updateSiteSettings(site: Site) {
  await db.siteSettings.update({ where: { id: 1 }, data: site });
}

export async function createEnquiry(input: {
  productCode?: string | null;
  productName?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
}) {
  await db.enquiry.create({
    data: {
      productCode: input.productCode ?? null,
      productName: input.productName ?? null,
      name: input.name,
      phone: input.phone,
      email: input.email ?? null,
      message: input.message ?? null,
    },
  });
}

export async function listEnquiries(): Promise<Enquiry[]> {
  const rows = await db.enquiry.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((r) => ({
    id: r.id,
    productCode: r.productCode,
    productName: r.productName,
    name: r.name,
    phone: r.phone,
    email: r.email,
    message: r.message,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function updateEnquiryStatus(id: number, status: string) {
  await db.enquiry.update({ where: { id }, data: { status } });
}

export async function deleteEnquiry(id: number) {
  await db.enquiry.delete({ where: { id } });
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  const rows = await db.adminUser.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map((r) => ({ id: r.id, username: r.username, createdAt: r.createdAt.toISOString() }));
}

export async function createAdminUser(username: string, password: string): Promise<AdminUser> {
  const row = await db.adminUser.create({
    data: { username, passwordHash: hashPassword(password) },
  });
  return { id: row.id, username: row.username, createdAt: row.createdAt.toISOString() };
}

export async function deleteAdminUser(id: number) {
  await db.adminUser.delete({ where: { id } });
}

export async function countAdminUsers(): Promise<number> {
  return db.adminUser.count();
}

export async function verifyAdminLogin(
  username: string,
  password: string
): Promise<AdminUser | null> {
  const row = await db.adminUser.findUnique({ where: { username } });
  if (!row) return null;
  if (!verifyPassword(password, row.passwordHash)) return null;
  return { id: row.id, username: row.username, createdAt: row.createdAt.toISOString() };
}
