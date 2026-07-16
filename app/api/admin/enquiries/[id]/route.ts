import { getSession } from "@/lib/auth";
import { deleteEnquiry, updateEnquiryStatus } from "@/lib/db/queries";

const VALID_STATUSES = ["new", "contacted", "closed"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || !VALID_STATUSES.includes(body.status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  updateEnquiryStatus(Number(id), body.status);
  return Response.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  deleteEnquiry(Number(id));
  return Response.json({ ok: true });
}
