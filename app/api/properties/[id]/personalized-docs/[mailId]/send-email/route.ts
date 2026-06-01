import { db } from "@/lib/client";
import { propertyProposalTemplate } from "@/lib/templates";
import { sendEmail } from "@/lib/transporter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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

    /* GET MAIL */

    const mail = await db.propertyProposalMail.findFirst({
      where: {
        id: mailId,
        propertyId: id,
      },
    });

    if (!mail) {
      return NextResponse.json(
        {
          success: false,
          message: "Mail not found",
        },
        { status: 404 }
      );
    }

    try {
      /* SEND EMAIL */

      await sendEmail({
        to: mail.recipientEmail,
        subject: mail.subject,
        html: propertyProposalTemplate({subject:mail.subject,body: mail.body,attachmentUrl: mail?.attachmentUrl || undefined}), 
      });

      /* UPDATE STATUS */

      const updatedMail =
        await db.propertyProposalMail.update({
          where: {
            id: mail.id,
          },

          data: {
            status: "SENT",
            sentAt: new Date(),
          },
        });

      return NextResponse.json(
        {
          success: true,
          message: "Email sent successfully",
          data: updatedMail,
        },
        { status: 200 }
      );
    } catch (mailError) {
      /* UPDATE FAILED STATUS */

      await db.propertyProposalMail.update({
        where: {
          id: mail.id,
        },

        data: {
          status: "FAILED",
        },
      });

      console.error(mailError);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to send email",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}