import { db } from "@/lib/client";
import { meetingEmailTemplate } from "@/lib/templates";
import { sendEmail } from "@/lib/transporter";
import { NextResponse } from "next/server";
import { z } from "zod";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const meetings = await db.leadMeeting.findMany({
      where: { leadId: id },
      orderBy: { scheduledAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: meetings,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
}

export const createMeetingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  scheduledAt: z.string().min(1), // ISO string from frontend
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    // ✅ VALIDATION
    const parsed = createMeetingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { title, location, scheduledAt } = parsed.data;

    const meeting = await db.leadMeeting.create({
      data: {
        leadId: id,
        title,
        location,
        scheduledAt: new Date(scheduledAt),
        status: "SCHEDULED",
        emailSent: false,
      },
      include: {
        lead: { include: { property: true } },
      },
    });
    const lead = meeting.lead;
    const property = lead.property;

    await sendEmail({
      to: lead.email,
      html: meetingEmailTemplate({
        name: lead.name,
        location: location,
        title: property?.title ?? "",
        scheduledAt: meeting.scheduledAt,
      }),
      subject: `Meeting Scheduled: ${title}`,
    });
    
    await db.leadMeeting.update({
      where: { id: meeting.id },
      data: { emailSent: true, status: "EMAIL_SENT" },
    });

    return NextResponse.json({
      success: true,
      data: meeting,
      message: "Meeting scheduled & email sent",
    });
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json(
      { success: false, message: "Failed to create meeting" },
      { status: 500 }
    );
  }
}
