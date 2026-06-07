import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const outbounds = await prisma.seedlingOutbound.findMany({
      include: { product: true },
      orderBy: { outboundDate: "desc" },
    });
    return NextResponse.json(outbounds);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch outbounds" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const outbound = await prisma.seedlingOutbound.create({
      data: {
        productId: body.productId,
        quantity: body.quantity,
        unit: body.unit,
        outboundDate: body.outboundDate ? new Date(body.outboundDate + "T00:00:00.000Z") : undefined,
        notes: body.notes,
      },
    });
    return NextResponse.json(outbound);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create outbound" }, { status: 500 });
  }
}
