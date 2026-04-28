import { STATUS } from "@/generated/prisma/enums";
import { db } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/leads?page=1&limit=10&search=john&status=NEW
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Query params
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

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
    const total = await db.leads.count({ where });

    // Paginated data
    const leads = await db.leads.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true
          }
        },
      },
    });

    return NextResponse.json({
      data: leads,
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
      { error: "Failed to fetch leads" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const params = req.nextUrl.searchParams
  const id = params.get("id")
  if (!id) {
    return NextResponse.json({ error: "ID is not provided" }, { status: 404 });
  }

  try {
    const leads = await db.leads.delete({
      where: { id },
    });
    if (leads) {
      return NextResponse.json(
        { message: "Deleted Successfully" },
        { status: 200, statusText: "OK" },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      budget,
      status,
      note,
      propertyId,
      fingerprint,
    } = body;

    // Basic validation
    if (!name || !email || !phone) {
      return NextResponse.json(
        { data: "Name, email, and phone are required" },
        { status: 403 },
      );
    }
    const fingerprinting = await db.fingerprints.findMany({
      where: {
        fingerprint: fingerprint,
      },
    });
    console.log(fingerprinting);

    if (fingerprinting.length > 0) {
      return NextResponse.json(
        {
          data: "You have already filled the form",
        },
        { status: 403 },
      );
    }
    const check = await db.leads.findMany({
      where: {
        OR: [
          {
            email: email,
          },
          {
            phone: phone,
          },
        ],
      },
    });

    if (check.length > 0) {
      return NextResponse.json(
        {
          data: "Email or Phone is already rigestered.",
        },
        { status: 403 },
      );
    }
    const lead = await db.leads.create({
      data: {
        name,
        email,
        phone,
        budget,
        note,
        fingerprints: {
          create: {
            fingerprint: fingerprint,
            username: name,
          },
        },
        status: status || STATUS.NEW,
        property: {
          connect: { id: propertyId },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Lead created successfully",
        data: lead,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(error);

    // Prisma duplicate email error
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 },
      );
    }

    const updatedLead = await db.leads.update({
      where: { id },
      data: {
        status: status as STATUS,
      },
    });

    return NextResponse.json(
      {
        message: "Lead status updated successfully",
        data: updatedLead,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 },
    );
  }
}
