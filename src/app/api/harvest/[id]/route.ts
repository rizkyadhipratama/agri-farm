import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const harvest = await prisma.harvest.update({
      where: { id: params.id },
      data: {
        productId: body.productId,
        quantity: parseFloat(body.quantity),
        unit: body.unit,
        quality: body.quality || null,
        harvestDate: body.harvestDate ? new Date(body.harvestDate + "T00:00:00.000Z") : undefined,
        notes: body.notes || null,
      },
    });
    return NextResponse.json(harvest);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update harvest" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.harvest.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete harvest" }, { status: 500 });
  }
}