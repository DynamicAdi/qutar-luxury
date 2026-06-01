import { db } from "@/lib/client";
import { NextResponse } from "next/server";
import { z } from "zod";

export const updateFollowupSchema = z.object({
  message: z.string().min(1).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const parsed = updateFollowupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await db.leadFollowup.update({
      where: { id }, // 👈 use params id directly
      data: parsed.data,
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Followup updated",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to update followup" },
      { status: 500 }
    );
  }
}