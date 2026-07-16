import { getSession } from "@/lib/auth";
import { createProduct, getProduct, listProducts } from "@/lib/db/queries";
import { parseProduct } from "@/lib/validation";

export async function GET() {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json(await listProducts());
}

export async function POST(request: Request) {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const product = parseProduct(await request.json().catch(() => null));
  if (!product) {
    return Response.json({ error: "Invalid product data" }, { status: 400 });
  }
  if (await getProduct(product.code)) {
    return Response.json({ error: `Product ${product.code} already exists` }, { status: 409 });
  }

  await createProduct(product);
  return Response.json(product, { status: 201 });
}
