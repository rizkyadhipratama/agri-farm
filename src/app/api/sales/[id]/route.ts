import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const sale = await prisma.sales.update({
      where: { id: params.id },
      data: {
        harvestId: body.harvestId,
        quantity: parseFloat(body.quantity),
        unitPrice: parseFloat(body.unitPrice),
        totalPrice: parseFloat(body.quantity) * parseFloat(body.unitPrice),
        buyerName: body.buyerName || null,
        salesDate: body.salesDate ? new Date(body.salesDate + "T00:00:00.000Z") : undefined,
        notes: body.notes || null,
      },
    });
    return NextResponse.json(sale);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update sale" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.sales.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete sale" }, { status: 500 });
  }
}
