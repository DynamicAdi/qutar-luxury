// app/api/upload/route.ts

import { writeFile, unlink, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "application/pdf",
];

function getExtension(type: string) {
  switch (type) {
    case "image/png":
      return ".png";
    case "image/jpeg":
    case "image/jpg":
      return ".jpg";
    case "image/webp":
      return ".webp";
    case "application/pdf":
      return ".pdf";
    default:
      return "";
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    /* type validation */
    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        { error: "Only PNG, JPG, JPEG, WEBP and PDF files are allowed" },
        { status: 400 }
      );
    }

    /* size validation */
    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = getExtension(file.type);
    const fileName = `${randomUUID()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public/uploads");

    // ensure folder exists
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    return Response.json({
      success: true,
      url: `/uploads/${fileName}`,
      fileName,
      type: file.type,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const fileUrl = body.path;

    if (!fileUrl || typeof fileUrl !== "string") {
      return Response.json({ error: "Invalid path" }, { status: 400 });
    }

    const fileName = path.basename(fileUrl);

    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadDir, fileName);

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