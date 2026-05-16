import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { db } from "@/lib/client";
import { z } from "zod";
import bcrypt from "bcrypt";

// export async function POST(req: Request) {
//   const { username, password } = await req.json();

//   if (username === "admin@qlp.qa" && password === "luxury") {
//     const token = await signToken({ username });

//     const res = NextResponse.json({ success: true });

//     res.cookies.set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       path: "/",
//     });

//     return res;
//   }

//   return NextResponse.json(
//     { error: "Invalid credentials" },
//     { status: 401 }
//   );
// }


const loginSchema = z.object({
  username: z.string().min(1, "Username or email required"),
  password: z.string().min(1, "Password required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);

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

    const { username, password } = parsed.data;

    // 🔍 find user by username OR email
    const admin = await db.adminUsers.findFirst({
      where: {
        OR: [
          { username },
          { email: username },
        ],
      },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 🔐 compare password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 🎟️ sign token (no role now)
    const token = await signToken({
      id: admin.id,
      email: admin.email,
    });

    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        image: admin.image,
      },
    });

    // 🍪 set cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}