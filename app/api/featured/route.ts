import { db } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const rawQuery = {
      category: searchParams.get("category") ?? undefined,
      propertyType: searchParams.get("propertyType") ?? undefined,
      targetType: searchParams.get("targetType") ?? undefined,
      status: searchParams.get("status") ?? undefined,
    };

    const items = await db.property.findMany({
      where: {
        featured: true,
        isHidden: false,
        category: rawQuery.category as any,
        propertyType: rawQuery.propertyType as any,
        targetType: rawQuery.targetType as any,
        status: rawQuery.status as any,
      },
      include: {
        address: true,
        customer: true,
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch properties",
        data: [],
      },
      { status: 500 }
    );
  }
}
