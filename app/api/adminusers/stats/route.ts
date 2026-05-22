import { db } from "@/lib/client";
import { getAdmin } from "@/lib/getAdmin";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { user,error } = await getAdmin();
    console.log()
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: error || "Unauthorized",
        },
        { status: 401 }
      );
    }

    const now = new Date();

    const sevenDaysAgo = new Date(
      now.getTime() - 1000 * 60 * 60 * 24 * 7
    );

    // total admins
    const totalAdmins = await db.adminUsers.count();

    // recently added admins
    const recentlyAdded = await db.adminUsers.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // active admins
    // since your schema currently has no isActive field,
    // we will treat all admins as active
    const activeAdmins = totalAdmins;

    return NextResponse.json(
      {
        success: true,

        data: {
          totalAdmins,
          activeAdmins,
          recentlyAdded,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch admin stats",
      },
      { status: 500 }
    );
  }
}