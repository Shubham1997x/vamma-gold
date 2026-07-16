import { createEnquiry } from "@/lib/db/queries";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== "string" || typeof body.phone !== "string") {
    return Response.json({ error: "Name and phone are required" }, { status: 400 });
  }
  if (!body.name.trim() || !body.phone.trim()) {
    return Response.json({ error: "Name and phone are required" }, { status: 400 });
  }

  createEnquiry({
    productCode: typeof body.productCode === "string" ? body.productCode : null,
    productName: typeof body.productName === "string" ? body.productName : null,
    name: body.name.trim(),
    phone: body.phone.trim(),
    email: typeof body.email === "string" ? body.email.trim() : null,
    message: typeof body.message === "string" ? body.message.trim() : null,
  });

  return Response.json({ ok: true }, { status: 201 });
}
