import { getSession } from "@/lib/auth";
import { deleteProduct, getProduct, updateProduct } from "@/lib/db/queries";
import { parseProduct } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { code } = await params;
  const existing = await getProduct(code);
  if (!existing) return Response.json({ error: "Product not found" }, { status: 404 });

  const product = parseProduct(await request.json().catch(() => null));
  if (!product) {
    return Response.json({ error: "Invalid product data" }, { status: 400 });
  }
  if (product.code !== code && (await getProduct(product.code))) {
    return Response.json({ error: `Product ${product.code} already exists` }, { status: 409 });
  }

  await updateProduct(code, product);
  return Response.json(product);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { code } = await params;
  if (!(await getProduct(code))) return Response.json({ error: "Product not found" }, { status: 404 });

  await deleteProduct(code);
  return Response.json({ ok: true });
}
