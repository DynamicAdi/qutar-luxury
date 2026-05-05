import { PROPERTY_STATUS, PROPERTY_TYPE } from "@/generated/prisma/enums";
import { db } from "@/lib/client";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";
    const usageType = searchParams.get("usageType")?.trim() || "";

    const state = searchParams.get("state")?.trim() || "";
    const street = searchParams.get("street")?.trim() || "";
    const locationsParam = searchParams.get("location")?.trim() || "";

    const full = searchParams.get("details");
    const id = searchParams.get("id");
    const custm = searchParams.get("customers");

    const priceMinRaw = searchParams.get("priceMin");
    const priceMaxRaw = searchParams.get("priceMax");

    const priceMin =
      priceMinRaw !== null && priceMinRaw !== "" ? Number(priceMinRaw) : null;

    const priceMax =
      priceMaxRaw !== null && priceMaxRaw !== "" ? Number(priceMaxRaw) : null;

    const cities = locationsParam
      ? locationsParam
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    if (custm) {
      const forCustomers = await db.property.findMany({
        where: {
          OR: [{ status: "AVAILABLE" }, { status: "RESERVED" }],
        },
        select: {
          id: true,
          title: true,
          address: true,
          price: true,
        },
      });

      return NextResponse.json({ data: forCustomers }, { status: 200 });
    }

    if (full) {
      if (!id) {
        return NextResponse.json(
          { error: "ID is not provided" },
          { status: 400 }
        );
      }

      const detailed = await db.property.findMany({
        where: { id },
        include: {
          address: true,
          agent: true,
        },
      });

      return NextResponse.json({ data: detailed }, { status: 200 });
    }

    /* ===========================
       MAIN STRICT WHERE
    =========================== */

    const where: any = {};

    if (category && category !== "ALL") where.category = category;
    if (usageType && usageType !== "ALL") where.usageType = usageType;
    if (status) where.status = status;

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (state || street || cities.length > 0) {
      where.address = { is: {} };

      if (state) where.address.is.state = state;
      if (street) where.address.is.street = street;

      if (cities.length > 0) {
        where.address.is.city = {
          in: cities,
        };
      }
    }

    if (priceMin !== null || priceMax !== null) {
      where.price = {};

      if (priceMin !== null && !isNaN(priceMin)) where.price.gte = priceMin;
      if (priceMax !== null && !isNaN(priceMax)) where.price.lte = priceMax;
    }

    const total = await db.property.count({ where });

    const property = await db.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        images: true,
        status: true,
        description: true,
        propertyType: true,
        usageType: true,
        pngImage: true,
        isHidden: true,
        address: true,
        BedRooms: true,
        Bathrooms: true,
        Area: true,
        price: true,
        category: true,
      },
    });

    /* ===========================
       IF NO RESULTS -> FALLBACK SUGGESTIONS
    =========================== */

    let suggestions: any[] = [];
    let suggestionMessage = "";
    let noResults = false;

    if (property.length === 0) {
      noResults = true;

      const suggestionWhere: any = {};

      if (category && category !== "ALL") suggestionWhere.category = category;
      if (usageType && usageType !== "ALL")
        suggestionWhere.usageType = usageType;

      if (state) {
        suggestionWhere.address = {
          is: {
            state,
          },
        };
        suggestionMessage = `No exact matches found. Explore similar properties in other areas of ${state}.`;
      } else if (cities.length > 0) {
        suggestionMessage = `No exact matches found. Explore similar properties in nearby Qatar locations.`;
      } else {
        suggestionMessage = `No exact matches found. Here are some other premium listings you may like.`;
      }

      suggestions = await db.property.findMany({
        where: suggestionWhere,
        take: 6,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          images: true,
          status: true,
          description: true,
          propertyType: true,
          usageType: true,
          pngImage: true,
          isHidden: true,
          address: true,
          BedRooms: true,
          Bathrooms: true,
          Area: true,
          price: true,
          category: true,
        },
      });

      if (suggestions.length === 0) {
        suggestions = await db.property.findMany({
          take: 6,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            title: true,
            images: true,
            status: true,
            description: true,
            propertyType: true,
            usageType: true,
            pngImage: true,
            isHidden: true,
            address: true,
            BedRooms: true,
            Bathrooms: true,
            Area: true,
            price: true,
            category: true,
          },
        });

        suggestionMessage =
          "No exact matches found. Here are some featured alternatives across Qatar.";
      }
    }

    return NextResponse.json({
      data: property,
      noResults,
      suggestions,
      suggestionMessage,
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
      { error: "Failed to fetch properties" },
      { status: 500 }
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
    const leads = await db.property.delete({
      where: { id },
    });
    if (leads) {
      return NextResponse.json(
        { message: "Deleted Successfully" },
        { status: 200, statusText: "OK" }
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
      title,
      description,
      documents = [],
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
      usageType,
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
        documents,
        Bathrooms,
        parking,
        furnishing,
        HoaFees,
        yearBuilt,
        targetType,
        usageType,
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
      documents,
      agentIds = [],
      usageType,
      toggleHide,
    } = body;

    if (toggleHide) {
      const data = await db.property.update({
        where: {
          id: id,
        },
        data: {
          isHidden: Boolean(toggleHide),
        },
      });
      return NextResponse.json({ data }, { status: 200 });
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
        ...(documents !== undefined && { documents }),
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
        usageType,
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
        ...(NearByLocations !== undefined && { NearByLocations }),
        ...(targetType !== undefined && { targetType }),
        // update address relation
        ...(addressId && {
          address: {
            connect: {
              id: addressId,
            },
          },
        }),
        ...(featured !== undefined && { featured }),
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

    return NextResponse.json({ error: error }, { status: 500 });
  }
}
