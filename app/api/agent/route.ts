import { db } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Query params
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const id = searchParams.get("id");

    if (id) {
      const data = await db.agent.findUnique({
        where: { id },
        include: { properties: true },
      });

      return NextResponse.json({ data }, { status: 200 });
    }

    const skip = (page - 1) * limit;

    // Filters
    const where: any = {
      ...(status && { status }),

      ...(search && {
        OR: [
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
          {
            phone: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    // Total count
    const total = await db.agent.count({ where });

    // Paginated data
    const agent = await db.agent.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        addedAt: "desc",
      },
      include: {
        _count: {
          select: {
            properties: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: agent,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch agent" },
      { status: 500 },
    );
  }
}
export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID is not provided" }, { status: 404 });
  }

  try {
    const agent = await db.agent.delete({
      where: { id },
    });
    if (agent) {
      return NextResponse.json(
        { message: "Deleted Successfully" },
        { status: 200, statusText: "OK" },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

/**
 * POST /api/agent
 * Create customer
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      bio,
      phone,
      propertyIds, // optional array of property ids
    } = body;

    // Required validation
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email and phone are required" },
        { status: 400 },
      );
    }

    const customer = await db.agent.create({
      data: {
        name,
        email,
        bio,
        phone,

        ...(propertyIds?.length && {
          properties: {
            connect: propertyIds.map((id: string) => ({ id })),
          },
        }),
      },
      include: {
        properties: true,
      },
    });

    return NextResponse.json(
      {
        message: "Customer created successfully",
        data: customer,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      id,
      name,
      bio,
      email,
      phone,
      propertyIds, // full replace property relations
    } = body;

    const customer = await db.agent.update({
      where: { id },
      data: {
        name,
        bio,
        email,
        phone,

        // Replace connected properties
        ...(propertyIds && {
          properties: {
            set: propertyIds.map((pid: string) => ({
              id: pid,
            })),
          },
        }),
      },
      include: {
        properties: true,
      },
    });

    return NextResponse.json(
      {
        message: "Customer updated successfully",
        data: customer,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 },
    );
  }
}
