import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  if (!(await getSession())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  if (!formData) return Response.json({ error: "Invalid form data" }, { status: 400 });

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return Response.json({ error: "No files provided" }, { status: 400 });
  }

  // Runtime uploads must live outside public/ — in production Next only serves
  // public/ assets that existed at build time, so files written there 404.
  // /images/* requests fall through to app/images/[filename]/route.ts instead.
  const imagesDir = path.join(process.cwd(), "uploads");
  await mkdir(imagesDir, { recursive: true });

  const paths: string[] = [];
  for (const file of files) {
    const extension = ALLOWED_TYPES[file.type];
    if (!extension) {
      return Response.json(
        { error: `Unsupported file type: ${file.type || "unknown"}` },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      return Response.json(
        { error: `${file.name} is larger than 5MB` },
        { status: 400 }
      );
    }

    const filename = `${randomBytes(8).toString("hex")}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(imagesDir, filename), buffer);
    paths.push(`/images/${filename}`);
  }

  return Response.json({ paths }, { status: 201 });
}
