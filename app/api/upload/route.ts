// app/api/upload/route.ts

import { writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // ✅ Type validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        { error: "Only PNG, JPG, JPEG, WEBP allowed" },
        { status: 400 }
      );
    }

    // ✅ Size validation
    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe filename
    const fileName = `${randomUUID()}.png`; // force PNG (since bg removed image)
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    return Response.json({
      success: true,
      url: `/uploads/${fileName}`,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}

// app/api/upload/route.ts
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const fileUrl = body.path; // e.g. "/uploads/abc.png"

    if (!fileUrl || typeof fileUrl !== "string") {
      return Response.json({ error: "Invalid path" }, { status: 400 });
    }

    // Normalize and extract filename only
    const fileName = path.basename(fileUrl);

    // Construct absolute safe path
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, fileName);

    // Extra safety check (ensure inside uploads dir)
    if (!filePath.startsWith(uploadDir)) {
      return Response.json({ error: "Invalid file location" }, { status: 400 });
    }

    await unlink(filePath);

    return Response.json({ success: true });
  } catch (err: any) {
    console.error(err);

    if (err.code === "ENOENT") {
      return Response.json({ error: "File not found" }, { status: 404 });
    }

    return Response.json({ error: "Delete failed" }, { status: 500 });
  }
}