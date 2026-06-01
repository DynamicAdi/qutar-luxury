import { db } from "@/lib/client";
import { getAdmin } from "@/lib/getAdmin";
import { uploadFile } from "@/lib/uploadImage";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const { user } = await getAdmin();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;

    const search = searchParams.get("search")?.trim() || "";

    const where: any = {
      // EXCLUDE CURRENT LOGGED IN USER
      id: {
        not: user.id,
      },
    };

    /* GLOBAL SEARCH */
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const admins = await db.adminUsers.findMany({
      where,

      orderBy: {
        createdAt: "desc",
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
        data: admins,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch admins",
      },
      { status: 500 }
    );
  }
}


const createAdminSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be atleast 2 characters"),

  email: z.email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be atleast 6 characters")
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const password =
      formData.get("password")?.toString() || "";

    const imageFile = formData.get(
      "image"
    ) as File | null;

    /* VALIDATE */

    const parsed = createAdminSchema.safeParse({
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

    /* CHECK EMAIL */

    const existingEmail =
      await db.adminUsers.findUnique({
        where: {
          email,
        },
      });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 409 }
      );
    }

    /* UPLOAD IMAGE */

    let image: string | null = null;

    if (imageFile && imageFile.size > 0) {
      image = await uploadFile(imageFile);
    }

    /* HASH PASSWORD */

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    /* CREATE */

    const admin = await db.adminUsers.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image,
      },

      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin created successfully",
        data: admin,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create admin",
      },
      { status: 500 }
    );
  }
}