// lib/getAdmin.ts

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth"; // your verify function
import { db } from "@/lib/client";

export async function getAdmin() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return {
        admin: null,
        error: "Unauthorized",
      };
    }

    // verify jwt
    const decoded = await verifyToken(token);

    if (!decoded?.id) {
      return {
        admin: null,
        error: "Invalid token",
      };
    }

    // fetch latest admin data
    const admin = await db.adminUsers.findUnique({
      where: {
        id: decoded.id as string,
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

    if (!admin) {
      return {
        admin: null,
        error: "Admin not found",
      };
    }

    return {
      user: admin,
      error: null,
    };
  } catch (error) {
    console.error(error);

    return {
      user: null,
      error: "Authentication failed",
    };
  }
}