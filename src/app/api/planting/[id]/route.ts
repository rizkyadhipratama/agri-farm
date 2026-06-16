import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const old = await prisma.plantingSeed.findUnique({ where: { id: params.id } });
    if (!old) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const [planting] = await prisma.$transaction([
      prisma.plantingSeed.update({
        where: { id: params.id },
        data: {
          productId: body.productId,
          quantity: body.quantity,
          unit: body.unit,
          plantingDate: body.plantingDate ? new Date(body.plantingDate + "T00:00:00.000Z") : undefined,
          notes: body.notes || null,
        },
      }),
      prisma.product.update({
        where: { id: old.productId },
        data: { stock: { increment: old.quantity } },
      }),
      prisma.product.update({
        where: { id: body.productId },
        data: { stock: { decrement: body.quantity } },
      }),
    ]);
    return NextResponse.json(planting);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update planting" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const old = await prisma.plantingSeed.findUnique({ where: { id: params.id } });
    if (!old) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.plantingSeed.delete({ where: { id: params.id } }),
      prisma.product.update({
        where: { id: old.productId },
        data: { stock: { increment: old.quantity } },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting planting:", error);
    return NextResponse.json({ error: "Gagal menghapus data penanaman" }, { status: 500 });
  }
}
