import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const plantings = await prisma.plantingSeed.findMany({
      include: { product: true },
      orderBy: { plantingDate: "desc" },
    });
    return NextResponse.json(plantings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plantings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const plantingDate = new Date(body.plantingDate + "T00:00:00.000Z");

    const [planting] = await prisma.$transaction([
      prisma.plantingSeed.create({
        data: {
          productId: body.productId,
          quantity: body.quantity,
          unit: body.unit,
          plantingDate: plantingDate,
          notes: body.notes || null,
        },
      }),
      prisma.product.update({
        where: { id: body.productId },
        data: { stock: { decrement: body.quantity } },
      }),
    ]);
    return NextResponse.json(planting);
  } catch (error) {
    console.error("Error creating planting:", error);
    return NextResponse.json({ error: "Failed to create planting" }, { status: 500 });
  }
}
