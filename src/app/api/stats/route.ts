import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [products, inbounds, harvests, sales, plantings, salesRecords, harvestRecords, locationList] = await Promise.all([
      prisma.product.count(),
      prisma.seedlingInbound.count(),
      prisma.harvest.count(),
      prisma.sales.count(),
      prisma.plantingSeed.count(),
      prisma.sales.findMany({ select: { totalPrice: true, salesDate: true } }),
      prisma.harvest.findMany({ select: { quantity: true, harvestDate: true } }),
      prisma.farmLocation.findMany({ select: { id: true, name: true, address: true } }),
    ]);

    const totalRevenue = salesRecords.reduce((sum, r) => sum + Number(r.totalPrice), 0);

    const monthlySales: { month: string; revenue: number }[] = [];
    const monthlyHarvests: { month: string; quantity: number }[] = [];
    const monthMap = new Map<string, { revenue: number; quantity: number }>();

    for (const r of salesRecords) {
      const key = r.salesDate.toISOString().slice(0, 7);
      const entry = monthMap.get(key) || { revenue: 0, quantity: 0 };
      entry.revenue += Number(r.totalPrice);
      monthMap.set(key, entry);
    }
    for (const r of harvestRecords) {
      const key = r.harvestDate.toISOString().slice(0, 7);
      const entry = monthMap.get(key) || { revenue: 0, quantity: 0 };
      entry.quantity += Number(r.quantity);
      monthMap.set(key, entry);
    }

    const sorted = Array.from(monthMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    for (const [month, data] of sorted) {
      monthlySales.push({ month, revenue: data.revenue });
      monthlyHarvests.push({ month, quantity: data.quantity });
    }

    return NextResponse.json({
      products,
      inbounds,
      harvests,
      sales,
      plantings,
      totalRevenue,
      monthlySales,
      monthlyHarvests,
      locations: locationList,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
