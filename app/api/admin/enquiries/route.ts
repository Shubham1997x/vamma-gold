import { getSession } from "@/lib/auth";
import { listEnquiries } from "@/lib/db/queries";

export async function GET() {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json(listEnquiries());
}
