import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import { uploadFile } from "@/lib/uploadImage";

const updateAdminSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be atleast 2 characters")
    .optional(),
  email: z.email("Invalid email address").optional(),

  password: z
    .string()
    .min(6, "Password must be atleast 6 characters")
    .optional(),

});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin ID is required",
        },
        { status: 400 }
      );
    }

    /* FORM DATA */

    const formData = await req.formData();

    const name =
      formData.get("name")?.toString();

    const email =
      formData.get("email")?.toString();

    const password =
      formData.get("password")?.toString();

    const imageFile = formData.get(
      "image"
    ) as File | null;

    /* VALIDATE */

    const parsed =
      updateAdminSchema.safeParse({
        name,
        email,
        password,
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

    /* CHECK EXISTING ADMIN */

    const existingAdmin =
      await db.adminUsers.findUnique({
        where: {
          id,
        },
      });

    if (!existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin not found",
        },
        { status: 404 }
      );
    }

    /* CHECK EMAIL */

    if (email) {
      const existingEmail =
        await db.adminUsers.findFirst({
          where: {
            email,

            NOT: {
              id,
            },
          },
        });

      if (existingEmail) {
        return NextResponse.json(
          {
            success: false,
            message: "Email already in use",
          },
          { status: 409 }
        );
      }
    }

    /* HASH PASSWORD */

    let hashedPassword:
      | string
      | undefined;

    if (password) {
      hashedPassword = await bcrypt.hash(
        password,
        10
      );
    }

    /* UPLOAD IMAGE */

    let uploadedImage:
      | string
      | undefined;

    if (
      imageFile &&
      imageFile.size > 0
    ) {
      uploadedImage = await uploadFile(
        imageFile
      );
    }

    /* UPDATE */

    const updatedAdmin =
      await db.adminUsers.update({
        where: {
          id,
        },

        data: {
          ...(name && { name }),

          ...(email && { email }),

          ...(uploadedImage && {
            image: uploadedImage,
          }),

          ...(hashedPassword && {
            password: hashedPassword,
          }),
        },

        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Admin updated successfully",

        data: updatedAdmin,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update admin",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin ID is required",
        },
        { status: 400 }
      );
    }

    /* CHECK ADMIN */

    const existingAdmin =
      await db.adminUsers.findUnique({
        where: {
          id,
        },
      });

    if (!existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin not found",
        },
        { status: 404 }
      );
    }

    /* DELETE */

    await db.adminUsers.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete admin",
      },
      { status: 500 }
    );
  }
}