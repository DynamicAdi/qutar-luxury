import { db } from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let getCounts = {
    totalProperties: 0,
    totalLeads: 0,
    totalCustomers: 0,
    totalBudget: 0,
    soldItems: 0
  };

  const totalprop = await db.property.count();
  const leads = await db.leads.count();
  const customers = await db.customers.count();
  const sold = await db.property.count({
    where: {
        status: "SOLD" 
    }
  })

  const topProperties = await db.property.findMany({
  take: 10, // top 10
  where: {
    isHidden: false,
  },
  select: {
    id: true,
    title: true,
    category: true,
    _count: {
      select: {
        Leads: true,
      },
    },
  },
  orderBy: {
    Leads: {
      _count: "desc",
    },
  },
});

  const result = await db.property.aggregate({
    _sum: {
      price: true,
    },
  });
  const totalPortfolioBudget = result._sum.price ?? 0;

  getCounts = {
    totalBudget: totalPortfolioBudget,
    totalCustomers: customers,
    totalLeads: leads,
    totalProperties: totalprop,
    soldItems: sold,
  }

  const grouped = await db.property.groupBy({
    by: ["category"],
    _count: {
      category: true,
    },
    orderBy: {
      category: "asc",
    },
  });

  const propertiesByCategory = grouped.map((row: any) => ({
    category: row.category,
    count: row._count.category,
  }));


  const currentYear = new Date().getFullYear();
  const start = new Date(`${currentYear}-01-01T00:00:00.000Z`);
  const end = new Date(`${currentYear + 1}-01-01T00:00:00.000Z`);

  const [leadRows, customerRows] = await Promise.all([
    db.$queryRaw<
      { month: number; count: bigint }[]
    >`
      SELECT EXTRACT(MONTH FROM "createdAt")::int AS month,
             COUNT(*)::bigint AS count
      FROM "Leads"
      WHERE "createdAt" >= ${start}
        AND "createdAt" < ${end}
      GROUP BY month
      ORDER BY month
    `,

    db.$queryRaw<
      { month: number; count: bigint }[]
    >`
      SELECT EXTRACT(MONTH FROM "createdAt")::int AS month,
             COUNT(*)::bigint AS count
      FROM "Customers"
      WHERE "createdAt" >= ${start}
        AND "createdAt" < ${end}
      GROUP BY month
      ORDER BY month
    `,
  ]);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const leadMap = Object.fromEntries(
    leadRows.map((row: any) => [row.month, Number(row.count)])
  );

  const customerMap = Object.fromEntries(
    customerRows.map((row: any) => [row.month, Number(row.count)])
  );

  const revenueData = months.map((month, index) => ({
    month,
    customers: customerMap[index + 1] ?? 0,
    leads: leadMap[index + 1] ?? 0,
  }));

  return NextResponse.json({
    counts: getCounts,
    propertiesByCategory,
    revenueData,
    topProperties
  }, {status: 200})
}
