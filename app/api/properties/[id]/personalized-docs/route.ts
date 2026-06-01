import { db } from "@/lib/client";
import { callGeminiWithRotation } from "@/lib/gemini";
import { getPrompt } from "@/lib/prompts";
import { uploadFile } from "@/lib/uploadImage";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const search = searchParams.get("search")?.toLowerCase() || "";

    const mails = await db.propertyProposalMail.findMany({
      where: {
        OR: search
          ? [
              {
                recipientName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                recipientEmail: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                subject: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ]
          : undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: mails,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch mails" },
      { status: 500 }
    );
  }
}

export const generateMailSchema = z.object({
  leadId: z.string().optional(),
  customName: z.string().optional(),
  customEmail: z.email("Invalid email address").optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await db.property.findUnique({
      where: {
        id: id,
      },
      include: { address: true },
    });
    if (!property) {
      throw Error("Id is Invalid!");
    }
    const address = property.address;
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const parsed = generateMailSchema.safeParse({
      leadId: formData.get("leadId") || undefined,
      customName: formData.get("customName") || undefined,
      customEmail: formData.get("customEmail") || undefined,
    });

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

    const { leadId, customName, customEmail } = parsed.data;
    if (!file) {
      return NextResponse.json(
        { success: false, message: "PDF is required" },
        { status: 400 }
      );
    }

    /* Upload PDF */
    const attachmentUrl = await uploadFile(file);

    /* Resolve recipient */
    let recipientName = "";
    let recipientEmail = "";

    if (leadId) {
      const lead = await db.leads.findUnique({
        where: { id: leadId },
      });

      if (!lead) {
        return NextResponse.json(
          { success: false, message: "User not found" },
          { status: 404 }
        );
      }

      recipientName = lead.name;
      recipientEmail = lead.email;
    } else {
      if (!customName || !customEmail) {
        return NextResponse.json(
          {
            success: false,
            message: "Custom name and email required",
          },
          { status: 400 }
        );
      }

      recipientName = customName;
      recipientEmail = customEmail;
    }
    /* Gemini prompt */
    const prompt = getPrompt({
      propertyTitle: property?.title || "Invalid",
      propertyType: property?.propertyType || "Invalid",
      propertyPrice: property?.price || "Invalid",
      propertyAddress: address.city,
      clientEmail: recipientEmail,
      clientName: recipientName,
      pdfUrl: attachmentUrl,
    });

    const body = JSON.parse(await callGeminiWithRotation(prompt));
    const created = await db.propertyProposalMail.create({
      data: {
        body: body.body,
        recipientEmail: recipientEmail,
        recipientName: recipientName,
        subject: body.subject,
        attachmentUrl: attachmentUrl,
        propertyId: id,
      },
    });
    return NextResponse.json({
      success: true,
      draft: created.body,
      subject: created.subject,
      attachmentUrl,
      recipientName,
      recipientEmail,
      id: created.id
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to generate draft" },
      { status: 500 }
    );
  }
}
