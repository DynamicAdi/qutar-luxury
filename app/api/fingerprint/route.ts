import { db } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const fingerprint = params.get("fingerprint");

    const search = await db.fingerprints.findMany({
        where: {
            fingerprint: fingerprint as string
        }
    })

    if (search.length > 0) {
        return NextResponse.json({success: true}, {status: 200})
    }
    return NextResponse.json({success: false}, {status: 200})
}