import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        category: body.category,
        unit: body.unit,
        minStock: body.minStock || 0,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const force = request.nextUrl.searchParams.get("force") === "true";

    const inboundCount = await prisma.seedlingInbound.count({
      where: { productId: params.id },
    });

    if (inboundCount > 0 && !force) {
      return NextResponse.json(
        { error: `Produk ini digunakan dalam ${inboundCount} data barang masuk.` },
        { status: 400 }
      );
    }

    if (force) {
      // Delete related inbound records first
      await prisma.seedlingInbound.deleteMany({
        where: { productId: params.id },
      });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
  }
}