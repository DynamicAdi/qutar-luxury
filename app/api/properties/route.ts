import { PROPERTY_STATUS, PROPERTY_TYPE } from "@/generated/prisma/enums";
import { db } from "@/lib/client";
import { NextResponse, NextRequest } from "next/server";

 
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Query params
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const full = searchParams.get("details");
    const id = searchParams.get("id");
    const custm = searchParams.get("customers")

    const skip = (page - 1) * limit;

    // Filters
    const where: any = {
        ...(category && {category}),
      ...(status && { status }),

      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }
        ],
      }),
    };

    // Total count
    const total = await db.property.count({ where });

    if (custm) {
      const forCustomers = await db.property.findMany({
        where: {
          OR: [
            {status: "AVAILABLE"},
            {status: "RESERVED"}
          ]
        },
        select: {
          id: true,
          title: true,
          address: true,
          price: true,
        }
      })

      return NextResponse.json({data: forCustomers}, {status: 200})
    }

    if (full) {
        if (!id) {
            return NextResponse.json({error: "ID is not provided"}, {status: 400})
        }
        const detailed = await db.property.findMany({
            where: {
                id: id
            },
            include: {

                address: true,
                agent: true,
            }
        })
        return NextResponse.json({
            data: detailed
        }, {status: 200})
    }
    // Paginated data
    const property = await db.property.findMany({
      where,
      skip,
      select: {
        id: true,
        title: true,
        images: true,
        status: true,
        description: true,
        propertyType: true,
        pngImage: true,
        isHidden: true,
        address: true,
        BedRooms: true,
        Bathrooms: true,
        Area: true,
        price: true,
        category: true
      },
      take: limit,
      orderBy: {
        createdAt: "desc",
      }
    });

    return NextResponse.json({
      data: property,
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
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
    if (!id) {
        return NextResponse.json({error: "ID is not provided"}, {status: 404})
    }

    try {
        const leads = await db.property.delete({
            where: { id }
        })
        if (leads) {
            return NextResponse.json({message: "Deleted Successfully"}, {status: 200, statusText: "OK"});
        }
    }
    catch (error) {
        return NextResponse.json({error: error}, {status: 500})
    }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      description,
      images = [],
      youtubeLink,
      amenities = [],
      features = [],
      category,
      status = "AVAILABLE",
      price,
      Area,
      featured,
      pngImage,
      propertyType,
      BedRooms = 0,
      Bathrooms = 0,
      parking = 0,
      furnishing = "Unfurnished",
      HoaFees = 0,
      yearBuilt,
      NearByLocations,
      targetType,
      addressId,
      agentIds = [],
    } = body;

    // basic validation
    if (!title || !description || !category || !price || !Area || !addressId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const property = await db.property.create({
      data: {
        title,
        description,
        images,
        youtubeLink,
        amenities,
        features,
        NearByLocations,
        category: category as PROPERTY_TYPE,
        status: status as PROPERTY_STATUS,
        pngImage,
        propertyType,
        price,
        Area,
        featured,
        BedRooms,
        Bathrooms,
        parking,
        furnishing,
        HoaFees,
        yearBuilt,
        targetType,
        // connect address
        address: {
          connect: {
            id: addressId,
          },
        },

        // connect multiple agents
        agent: {
          connect: agentIds.map((id: string) => ({
            id,
          })),
        },
      },
      include: {
        address: true,
        agent: true,
      },
    });

    return NextResponse.json(
      {
        message: "Property created successfully",
        data: property,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}

// app/api/properties/route.ts

export async function PUT(req: NextRequest) {
  try {

    const body = await req.json();
    const {
      id,

      title,
      description,
      images,
      youtubeLink,
      amenities,
      features,
      isHidden,
      category,
      status,
      price,
      Area,
      featured,
      pngImage,
      propertyType,
      NearByLocations,
      BedRooms,
      Bathrooms,
      parking,
      furnishing,
      HoaFees,
      yearBuilt,
      targetType,
      addressId,
      agentIds = [],

      toggleHide
    } = body;

    if (toggleHide) {
      const data = await db.property.update({
        where: {
          id: id
        },
        data: {
          isHidden: Boolean(toggleHide)
        }
      });
    return NextResponse.json({data}, {status: 200})  
}


    if (!id) {
      return NextResponse.json(
        { error: "Property id is required" },
        { status: 400 }
      );
    }

    const property = await db.property.update({
      where: {
        id,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(images !== undefined && { images }),
        ...(youtubeLink !== undefined && { youtubeLink }),
        ...(amenities !== undefined && { amenities }),
        ...(features !== undefined && { features }),
        isHidden: isHidden ?? false,
        ...(category !== undefined && {
          category: category as PROPERTY_TYPE,
        }),

        ...(status !== undefined && {
          status: status as PROPERTY_STATUS,
        }),

        ...(price !== undefined && { price }),
        ...(Area !== undefined && { Area }),
        ...(pngImage !== undefined && { pngImage }),
        ...(propertyType !== undefined && { propertyType }),

        ...(BedRooms !== undefined && { BedRooms }),
        ...(Bathrooms !== undefined && { Bathrooms }),
        ...(parking !== undefined && { parking }),
        ...(furnishing !== undefined && { furnishing }),
        ...(HoaFees !== undefined && { HoaFees }),
        ...(yearBuilt !== undefined && { yearBuilt }),
        ...(NearByLocations !== undefined && {NearByLocations}),
        ...(targetType !== undefined && {targetType}),
        // update address relation
        ...(addressId && {
          address: {
            connect: {
              id: addressId,
            },
          },
        }),
        ...(featured !== undefined && {featured}),
        ...(agentIds && {
          agent: {
            connect: agentIds.map((agentId: string) => ({
              id: agentId,
            })),
          },
        }),
      },
      include: {
        address: true,
        agent: true,
      },
    });

    return NextResponse.json({
      message: "Property updated successfully",
      data: property,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: error },
      { status: 500 }
    );
  }
}