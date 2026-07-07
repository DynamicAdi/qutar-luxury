import { db } from "@/lib/client";
import { meetingCancelledEmailTemplate } from "@/lib/templates";
import { sendEmail } from "@/lib/transporter";
import { NextResponse } from "next/server";
import { z } from "zod";

export const updateMeetingSchema = z.object({
  title: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  scheduledAt: z.string().optional(),
  status: z
    .enum(["SCHEDULED", "EMAIL_SENT", "COMPLETED", "CANCELLED"])
    .optional(),
  emailSent: z.boolean().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ meetId: string }> }
) {
  const { meetId } = await params;
  try {
    const body = await req.json();

    // ✅ VALIDATION
    const parsed = updateMeetingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const updated = await db.leadMeeting.update({
      where: { id: meetId },
      data: {
        ...data,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
      },
      include: { lead: { include: { property: true } } },
    });
    const lead = updated.lead;
    const property = lead.property;
    if (data.status && data.status === "CANCELLED") {
      await sendEmail({
        to: lead.email,
        html: meetingCancelledEmailTemplate({
          name: lead.name,
          location: updated.location,
          scheduledAt: updated.scheduledAt,
          title: property?.title ?? "Invalid Property",
        }),
        subject: `Meeting Cancelled – ${lead.name}`,
      });
    }
    return NextResponse.json({
      success: true,
      data: updated,
      message: "Meeting updated successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Update failed", error: err },
      { status: 500 }
    );
  }
}
