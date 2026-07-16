import { getSession } from "@/lib/auth";
import { createAdminUser, listAdminUsers } from "@/lib/db/queries";
import { db } from "@/lib/db";

export async function GET() {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json(listAdminUsers());
}

export async function POST(request: Request) {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.username !== "string" ||
    typeof body.password !== "string" ||
    !body.username.trim() ||
    body.password.length < 8
  ) {
    return Response.json(
      { error: "Username is required and password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const existing = db
    .prepare("SELECT id FROM admin_users WHERE username = ?")
    .get(body.username.trim());
  if (existing) {
    return Response.json({ error: "Username already exists" }, { status: 409 });
  }

  const user = createAdminUser(body.username.trim(), body.password);
  return Response.json(user, { status: 201 });
}
