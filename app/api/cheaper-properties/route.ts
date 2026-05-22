import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/client";
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Property id is required",
          data: null,
        },
        { status: 400 }
      );
    }

    // Get reference property
    const currentProperty = await prisma.property.findUnique({
      where: { id ,isHidden: false },
      select: {
        id: true,
        price: true,
      },
    });

    if (!currentProperty) {
      return NextResponse.json(
        {
          success: false,
          message: "Property not found",
          data: null,
        },
        { status: 404 }
      );
    }

    // Get cheaper properties
    const data = await prisma.property.findMany({
      where: {
        price: {
          lt: currentProperty.price,
        },
        isHidden: false,
      },
      orderBy: {
        price: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cheaper properties fetched successfully",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        data: null,
      },
      { status: 500 }
    );
  }
}