// app/api/location-filters/route.ts

import { db } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";

type StreetMap = Record<string, string[]>;
type CityMap = Record<string, StreetMap>;

export async function GET(_req: NextRequest) {
  try {
    const addresses = await db.address.findMany({
      select: {
        state: true,
        city: true,
        street: true,
      },
      orderBy: [
        { state: "asc" },
        { city: "asc" },
        { street: "asc" },
      ],
    });

    const data: Record<string, CityMap[string]> = {};

    for (const item of addresses) {
      const state = item.state?.trim();
      const city = item.city?.trim();
      const street = item.street?.trim();

      if (!state || !city || !street) continue;

      // Create state
      if (!data[state]) {
        data[state] = {};
      }

      // Create city inside state
      if (!data[state][city]) {
        data[state][city] = [];
      }

      // Add street if unique
      if (!data[state][city].includes(street)) {
        data[state][city].push(street);
      }
    }

    return NextResponse.json(
      {
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        error: "Failed to fetch location filters",
      },
      { status: 500 }
    );
  }
}