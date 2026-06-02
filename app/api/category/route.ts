import { db } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const data = await db.category.findMany({});
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Failed to fetch addresses",
        message: error,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID is required", message: "ID is required" },
        { status: 400 },
      );
    }

    await db.category.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Address deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete addresses", message: error },
      { status: 500 },
    );
  }
}

/**
 * POST /api/address
 * Create a new Address
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, subTitle, image, slug } = body;

    // Basic validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and link are required" },
        { status: 400 },
      );
    }

    const category = await db.category.create({
      data: {
        name,
        subTitle,
        image,
        slug,
      },
    });

    return NextResponse.json(
      {
        message: "Category created successfully",
        data: category,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST Address Error:", error);

    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 },
    );
  }
}
// PUT /api/address/:id
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const { id, name, subTitle, image, slug } = body;

    const category = await db.category.update({
      where: {
        id: id,
      },
      data: {
        name,
        subTitle,
        image,
        slug,
      },
    });

    return NextResponse.json(
      {
        message: "Category updated successfully",
        data: category,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 },
    );
  }
}
