import { verifyAdminLogin } from "@/lib/db/queries";
import { createSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.username !== "string" || typeof body.password !== "string") {
    return Response.json({ error: "Username and password are required" }, { status: 400 });
  }

  const user = await verifyAdminLogin(body.username, body.password);
  if (!user) {
    return Response.json({ error: "Invalid username or password" }, { status: 401 });
  }

  await createSessionCookie(user.id);
  return Response.json({ ok: true });
}
