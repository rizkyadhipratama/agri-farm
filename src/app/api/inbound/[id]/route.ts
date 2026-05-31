import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";


export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const inbound = await prisma.seedlingInbound.update({
      where: { id: params.id },
      data: {
      id: body.id,
      productId: body.productId,
      quantity: body.quantity,
      unit: body.unit,
      price: parseFloat(body.price),
      inboundDate: body.inboundDate ? new Date(body.inboundDate + "T00:00:00.000Z") : undefined,
      notes: body.notes || null,
      },
    });
    return NextResponse.json(inbound);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update inbound" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    
    await prisma.seedlingInbound.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting inbound:", error);
    return NextResponse.json({ error: "Gagal menghapus data pembelian" }, { status: 500 });
  }
}
