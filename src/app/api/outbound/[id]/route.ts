import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const outbound = await prisma.seedlingOutbound.update({
      where: { id: params.id },
      data: {
        productId: body.productId,
        quantity: parseInt(body.quantity),
        unit: body.unit,
        outboundDate: body.outboundDate ? new Date(body.outboundDate + "T00:00:00.000Z") : undefined,
        notes: body.notes || null,
      },
    });
    return NextResponse.json(outbound);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update outbound" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.seedlingOutbound.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete outbound" }, { status: 500 });
  }
}
