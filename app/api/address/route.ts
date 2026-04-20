import { db } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const query = searchParams.get('all');

        if (query) {
            const address = await db.address.findMany({
                include: {
                    properties: true,
                }
            });
            return NextResponse.json({data: address}, {status: 200})
        }

        const address = await db.address.findMany()
        return NextResponse.json({data: address}, {status: 200})

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch addresses", message: error }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const {id} = await req.json()
        if (!id) {
            return NextResponse.json({ error: "ID is required", message: "ID is required" }, { status: 400 });
        }

        await db.address.delete({
            where: {id}
        })
        return NextResponse.json({ message: "Address deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete addresses", message: error }, { status: 500 });
    }
}


/**
 * POST /api/address
 * Create a new Address
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      city,
      street,
      state,
      zipCode,
      longitude,
      latitude,
      nearbyPlaces,
      gmaps,
    } = body;

    // Basic validation
    if (!city || !street || !state || !zipCode) {
      return NextResponse.json(
        { error: "city, street, state, zipCode are required" },
        { status: 400 }
      );
    }

    const address = await db.address.create({
      data: {
        city,
        street,
        state,
        zipCode,
        longitude,
        latitude,
        nearbyPlaces: nearbyPlaces || [],
        gmaps,
      },
    });

    return NextResponse.json(
      {
        message: "Address created successfully",
        data: address,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Address Error:", error);

    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}
// PUT /api/address/:id
export async function PUT(
  req: NextRequest
) {
  try {
    const body = await req.json();

    const {
       id,
      city,
      street,
      state,
      zipCode,
      longitude,
      latitude,
      nearbyPlaces,
      gmaps,
    } = body;

    const updatedAddress = await db.address.update({
      where: {
        id: id,
      },
      data: {
        city,
        street,
        state,
        zipCode,
        longitude,
        latitude,
        nearbyPlaces,
        gmaps,
      },
    });

    return NextResponse.json(
      {
        message: "Address updated successfully",
        data: updatedAddress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}