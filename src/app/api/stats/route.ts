import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [products, inbounds, harvests, sales] = await Promise.all([
      prisma.product.count(),
      prisma.seedlingInbound.count(),
      prisma.harvest.count(),
      prisma.sales.count(),
    ]);

    const totalRevenue = await prisma.sales.aggregate({
      _sum: { totalPrice: true },
    });

    return NextResponse.json({
      products,
      inbounds,
      harvests,
      sales,
      totalRevenue: totalRevenue._sum.totalPrice?.toNumber() || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
