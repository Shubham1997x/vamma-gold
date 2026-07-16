import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth";

const db = new PrismaClient();

async function main() {
  const productCount = await db.product.count();
  if (productCount === 0) {
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

    for (const p of seedProducts) {
      await db.product.create({
        data: {
          code: p.code,
          name: p.name,
          category: p.category,
          subcategory: p.subcategory,
          grossWeight: p.grossWeight,
          netWeight: p.netWeight,
          size: p.size,
          images: { create: [{ path: p.image, sortOrder: 0 }] },
        },
      });
    }
    console.log(`[seed] Created ${seedProducts.length} products`);
  }

  const siteCount = await db.siteSettings.count();
  if (siteCount === 0) {
    await db.siteSettings.create({
      data: {
        id: 1,
        name: "Vamma Gold",
        tagline: "Shine Bright With Us",
        whatsappNumber: "918156087999",
        whatsappDisplay: "+91 81560-87999",
        enquiryEmail: "enquiry@vammagold.com",
        website: "vamma.wantace.org",
      },
    });
    console.log("[seed] Created default site settings");
  }

  const userCount = await db.adminUser.count();
  if (userCount === 0) {
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || "vamma-admin";
    await db.adminUser.create({
      data: { username: "admin", passwordHash: hashPassword(initialPassword) },
    });
    if (!process.env.ADMIN_INITIAL_PASSWORD) {
      console.warn(
        `[seed] Created admin account with username "admin" and password "vamma-admin". ` +
          `Set ADMIN_INITIAL_PASSWORD before first run in production, or change the password from /admin/users after logging in.`
      );
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
