import { NextResponse } from "next/server";
import { db } from "@/lib/client";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const lead = await db.leads.findUnique({
      where: { id },
      include: {
        property: { include: { address: true } },
      },
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    // 🔥 SEPARATED STRUCTURE
    const data = {
      sections: [
        {
          title: "Lead Information",
          fields: [
            { label: "Name", value: lead.name },
            { label: "Email", value: lead.email },
            { label: "Phone", value: lead.phone },
            { label: "Budget", value: lead.budget },
            { label: "Status", value: lead.status },
            { label: "Note", value: lead.note },
          ],
        },
      ],
    };
    if (lead.property) {
      data.sections.push({
        title: "Property Information",
        fields: [
          { label: "Title", value: lead.property?.title ?? "" },
          { label: "Category", value: lead.property?.category ?? "" },
          { label: "Type", value: lead.property?.propertyType ?? "" },
          { label: "Status", value: lead.property?.status ?? "" },
          { label: "Price", value: String(lead.property?.price) ?? "" },
          { label: "Area", value: String(lead.property?.Area) ?? "" },
          { label: "Bedrooms", value: String(lead.property?.BedRooms) ?? "" },
          { label: "Bathrooms", value: String(lead.property?.Bathrooms) ?? "" },
          { label: "Parking", value: String(lead.property?.parking) ?? "" },
          { label: "Furnishing", value: String(lead.property?.furnishing) ?? "" },
          { label: "Year Built", value: String(lead.property?.yearBuilt) ?? "" },
        ],
      });
    }
    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Server error", error: err },
      { status: 500 }
    );
  }
}
