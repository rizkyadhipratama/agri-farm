import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const harvests = await prisma.harvest.findMany({
      include: { product: true },
      orderBy: { harvestDate: "desc" },
    });
    return NextResponse.json(harvests);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch harvests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const harvest = await prisma.harvest.create({
      data: {
        productId: body.productId,
        quantity: body.quantity,
        unit: body.unit,
        quality: body.quality,
        harvestDate: body.harvestDate ? new Date(body.harvestDate + "T00:00:00.000Z") : undefined,
        notes: body.notes,
      },
    });
    return NextResponse.json(harvest);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create harvest" }, { status: 500 });
  }
}
