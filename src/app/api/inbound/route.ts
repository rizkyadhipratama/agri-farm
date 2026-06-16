import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const inbounds = await prisma.seedlingInbound.findMany({
      include: { product: true, supplier: true },
      orderBy: { inboundDate: "desc" },
    });
    return NextResponse.json(inbounds);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inbounds" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inboundDate = new Date(body.inboundDate + "T00:00:00.000Z");

    const [inbound] = await prisma.$transaction([
      prisma.seedlingInbound.create({
        data: {
          productId: body.productId,
          quantity: body.quantity,
          unit: body.unit,
          price: body.price,
          inboundDate: inboundDate,
          notes: body.notes || null,
        },
      }),
      prisma.product.update({
        where: { id: body.productId },
        data: { stock: { increment: body.quantity } },
      }),
    ]);
    return NextResponse.json(inbound);
  } catch (error) {
    console.error("Error creating inbound:", error);
    return NextResponse.json({ error: "Failed to create inbound" }, { status: 500 });
  }
}
