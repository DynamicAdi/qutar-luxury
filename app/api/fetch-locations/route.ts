import { db } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  try {
    const searchParams =
      req.nextUrl.searchParams;

    const state =
      searchParams.get("state") || "";

    const city =
      searchParams.get("city") || "";

    const addresses =
      await db.address.findMany({
        select: {
          state: true,
          city: true,
          street: true,
        },
      });

    const stateSet =
      new Set<string>();

    const citySet =
      new Set<string>();

    const streetSet =
      new Set<string>();

    addresses.forEach((item) => {
      if (item.state)
        stateSet.add(item.state);

      if (
        (!state ||
          item.state === state) &&
        item.city
      ) {
        citySet.add(item.city);
      }

      if (
        (!state ||
          item.state === state) &&
        (!city ||
          item.city === city) &&
        item.street
      ) {
        streetSet.add(item.street);
      }
    });

    return NextResponse.json({
      states: Array.from(
        stateSet
      ).sort(),

      cities: Array.from(
        citySet
      ).sort(),

      streets: Array.from(
        streetSet
      ).sort(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Failed to fetch places",
      },
      { status: 500 }
    );
  }
}