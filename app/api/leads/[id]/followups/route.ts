import { NextResponse } from "next/server";
import { db } from "@/lib/client";
import { z } from "zod";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const {id} = await params;
    const followups = await db.leadFollowup.findMany({
      where: { leadId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: followups,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch followups" },
      { status: 500 }
    );
  }
}

const createFollowupSchema = z.object({
  message: z.string().min(1, "Message is required"),
});
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const {id} = await params;
    const parsed = createFollowupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const followup = await db.leadFollowup.create({
      data: {
        leadId: id,
        message: parsed.data.message,
      },
    });

    return NextResponse.json({
      success: true,
      data: followup,
      message: "Followup created",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to create followup" },
      { status: 500 }
    );
  }
}