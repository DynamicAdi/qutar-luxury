import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === "admin@qlp.qa" && password === "luxury") {
    const token = await signToken({ username });

    const res = NextResponse.json({ success: true });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return res;
  }

  return NextResponse.json(
    { error: "Invalid credentials" },
    { status: 401 }
  );
}