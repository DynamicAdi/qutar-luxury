import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/client";
import { z } from "zod";

export const updateMailSchema = z.object({
  subject: z.string().optional(),
  body: z.string().min(1, "Body is required"),
  recipientName: z.string().optional(),
  recipientEmail: z.email("Invalid email").optional(),
  status: z.enum(["DRAFT", "SENT", "FAILED"]).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ mailId: string }> }
) {
  try {
    const { mailId } = await params;

    if (!mailId) {
      return NextResponse.json(
        { success: false, message: "ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    /* ZOD VALIDATION */
    const parsed = updateMailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      subject,
      body: mailBody,
      recipientName,
      recipientEmail,
      status,
    } = parsed.data;

    const updated = await db.propertyProposalMail.update({
      where: { id: mailId },
      data: {
        subject,
        body: mailBody,
        recipientName,
        recipientEmail,
        status,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Mail updated successfully",
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      mailId: string;
    }>;
  }
) {
  try {
    const { id, mailId } = await params;

    if (!id || !mailId) {
      return NextResponse.json(
        {
          success: false,
          message: "Property ID and Mail ID are required",
        },
        { status: 400 }
      );
    }

    /* CHECK PROPERTY */

    const property = await db.property.findUnique({
      where: {
        id,
      },
    });

    if (!property) {
      return NextResponse.json(
        {
          success: false,
          message: "Property not found",
        },
        { status: 404 }
      );
    }

    /* CHECK MAIL */

    const existingMail = await db.propertyProposalMail.findFirst({
      where: {
        id: mailId,
        propertyId: id,
      },
    });

    if (!existingMail) {
      return NextResponse.json(
        {
          success: false,
          message: "Mail not found",
        },
        { status: 404 }
      );
    }

    /* DELETE */

    await db.propertyProposalMail.delete({
      where: {
        id: mailId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Mail deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete mail",
      },
      { status: 500 }
    );
  }
}
