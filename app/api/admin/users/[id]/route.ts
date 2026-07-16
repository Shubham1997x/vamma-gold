import { getSession } from "@/lib/auth";
import { countAdminUsers, deleteAdminUser } from "@/lib/db/queries";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userId = Number(id);

  if (countAdminUsers() <= 1) {
    return Response.json({ error: "Cannot delete the last remaining admin" }, { status: 400 });
  }
  if (userId === session.userId) {
    return Response.json({ error: "Cannot delete your own account while logged in" }, { status: 400 });
  }

  deleteAdminUser(userId);
  return Response.json({ ok: true });
}
