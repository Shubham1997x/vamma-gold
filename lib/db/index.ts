import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import path from "path";
import { hashPassword } from "@/lib/auth";

const dataDir = path.join(process.cwd(), "data");
mkdirSync(dataDir, { recursive: true });

const globalForDb = globalThis as unknown as { __vammaDb?: Database.Database };

export const db = globalForDb.__vammaDb ?? new Database(path.join(dataDir, "vamma-gold.db"));
if (process.env.NODE_ENV !== "production") globalForDb.__vammaDb = db;

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    gross_weight REAL,
    net_weight REAL,
    size TEXT
  );

  CREATE TABLE IF NOT EXISTS product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_code TEXT NOT NULL REFERENCES products(code) ON DELETE CASCADE,
    path TEXT NOT NULL,
    sort_order INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    whatsapp_display TEXT NOT NULL,
    enquiry_email TEXT NOT NULL,
    website TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_code TEXT,
    product_name TEXT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL
  );
`);

function migrateLegacyImageColumn() {
  const columns = db.prepare("PRAGMA table_info(products)").all() as { name: string }[];
  if (!columns.some((c) => c.name === "image")) return;

  const rows = db.prepare("SELECT code, image FROM products").all() as {
    code: string;
    image: string;
  }[];
  const insertImage = db.prepare(
    "INSERT INTO product_images (product_code, path, sort_order) VALUES (?, ?, 0)"
  );
  const migrate = db.transaction((productRows: typeof rows) => {
    for (const row of productRows) insertImage.run(row.code, row.image);
    db.exec("ALTER TABLE products DROP COLUMN image");
  });
  migrate(rows);
}

migrateLegacyImageColumn();

function seedIfEmpty() {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM products").get() as {
    count: number;
  };
  if (count > 0) return;

  const insertProduct = db.prepare(`
    INSERT INTO products (code, name, category, subcategory, gross_weight, net_weight, size)
    VALUES (@code, @name, @category, @subcategory, @grossWeight, @netWeight, @size)
  `);
  const insertImage = db.prepare(
    "INSERT INTO product_images (product_code, path, sort_order) VALUES (?, ?, 0)"
  );
  const seedProducts = [
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
      netWeight: null,
      size: null,
    },
  ];
  const insertMany = db.transaction((rows: typeof seedProducts) => {
    for (const row of rows) {
      insertProduct.run(row);
      insertImage.run(row.code, row.image);
    }
  });
  insertMany(seedProducts);

  db.prepare(
    `INSERT INTO site_settings (id, name, tagline, whatsapp_number, whatsapp_display, enquiry_email, website)
     VALUES (1, @name, @tagline, @whatsappNumber, @whatsappDisplay, @enquiryEmail, @website)`
  ).run({
    name: "Vamma Gold",
    tagline: "Shine Bright With Us",
    whatsappNumber: "918156087999",
    whatsappDisplay: "+91 81560-87999",
    enquiryEmail: "enquiry@vammagold.com",
    website: "vamma.wantace.org",
  });

  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || "vamma-admin";
  db.prepare(
    `INSERT INTO admin_users (username, password_hash, created_at) VALUES (?, ?, ?)`
  ).run("admin", hashPassword(initialPassword), new Date().toISOString());

  if (!process.env.ADMIN_INITIAL_PASSWORD) {
    console.warn(
      `[db] Seeded admin account with username "admin" and password "vamma-admin". ` +
        `Set ADMIN_INITIAL_PASSWORD before first run in production, or change the password from /admin/users after logging in.`
    );
  }
}

seedIfEmpty();
