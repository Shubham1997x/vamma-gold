import { getSession } from "@/lib/auth";
import { getSiteSettings, updateSiteSettings } from "@/lib/db/queries";
import type { Site } from "@/lib/site";

function parseSite(body: unknown): Site | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const fields = [
    "name",
    "tagline",
    "whatsappNumber",
    "whatsappDisplay",
    "enquiryEmail",
    "website",
  ] as const;
  for (const field of fields) {
    if (typeof b[field] !== "string" || !(b[field] as string).trim()) return null;
  }
  return {
    name: (b.name as string).trim(),
    tagline: (b.tagline as string).trim(),
    whatsappNumber: (b.whatsappNumber as string).trim(),
    whatsappDisplay: (b.whatsappDisplay as string).trim(),
    enquiryEmail: (b.enquiryEmail as string).trim(),
    website: (b.website as string).trim(),
  };
}

export async function GET() {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json(await getSiteSettings());
}

export async function PUT(request: Request) {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const site = parseSite(await request.json().catch(() => null));
  if (!site) return Response.json({ error: "Invalid site data" }, { status: 400 });

  await updateSiteSettings(site);
  return Response.json(site);
}
