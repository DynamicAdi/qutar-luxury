// app/api/properties/bulk-create/route.ts

import { db } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json(
        {
          success: false,
          message: "Request body must be an array of properties"
        },
        { status: 400 }
      );
    }

    const createdProperties = [];
    const failedProperties = [];

    for (const item of body) {
      try {
        const {
          title,
          description,
          images = [],
          youtubeLink = null,
          amenities = [],
          features = [],
          category,
          status = "AVAILABLE",
          price,
          Area,
          pngImage = null,
          propertyType,
          BedRooms = 0,
          Bathrooms = 0,
          parking = 0,
          furnishing = "Unfurnished",
          HoaFees = 0,
          yearBuilt = null,
          NearByLocations = [],
          addressId,
          agentIds = []
        } = item;

        // minimal validation
        if (
          !title ||
          !description ||
          !category ||
          !propertyType ||
          !price ||
          !Area ||
          !addressId
        ) {
          failedProperties.push({
            title: title || "Unknown",
            reason: "Missing required fields"
          });
          continue;
        }

        const property = await db.property.create({
          data: {
            title,
            description,
            images,
            youtubeLink,
            amenities,
            features,
            category,
            status,
            price: Number(price),
            Area: Number(Area),
            pngImage,
            propertyType,
            BedRooms: Number(BedRooms),
            Bathrooms: Number(Bathrooms),
            parking: Number(parking),
            furnishing,
            HoaFees: Number(HoaFees),
            yearBuilt: yearBuilt ? Number(yearBuilt) : null,
            NearByLocations,
            addressId,

            agent:
              agentIds.length > 0
                ? {
                    connect: agentIds.map((id: string) => ({ id }))
                  }
                : undefined
          },
          include: {
            address: true,
            agent: true
          }
        });

        createdProperties.push(property);
      } catch (error: any) {
        failedProperties.push({
          title: item?.title || "Unknown",
          reason: error.message
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Bulk property creation completed",
        totalReceived: body.length,
        createdCount: createdProperties.length,
        failedCount: failedProperties.length,
        createdProperties,
        failedProperties
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("BULK_PROPERTY_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message
      },
      { status: 500 }
    );
  }
}